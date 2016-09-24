use std::path::{Path,PathBuf};
use std::ffi::OsStr;
use std::{env,fs};
use std::collections::HashMap;

use open;
use clap::ArgMatches;

use asciii::CONFIG;
use asciii::config;
use asciii::util;
use asciii::BillType;
use asciii::version as asciii_version;
use asciii::actions;
use asciii::storage::*;
use asciii::templater::Templater;
use asciii::project::Project;
use asciii::project::spec::VirtualField;

#[cfg(feature="document_export")]
use rustc_serialize::json::ToJson;

use super::{setup_luigi, setup_luigi_with_git, fail};
use asciii::print;
use asciii::print::{ListConfig, ListMode};
//simple_rows, verbose_rows,
//path_rows, dynamic_rows,
//print_projects,print_csv};

// TODO refactor this into actions module and actual, short subcommands

/// Create NEW Project
#[deprecated(note="move to asciii::actions")]
pub fn new(matches:&ArgMatches){
    let project_name     = matches.value_of("name").expect("You did not pass a \"Name\"!");
    let editor           = CONFIG.get("editor").and_then(|e|e.as_str());

    let template_name = matches.value_of("template")
        .or( CONFIG.get("template").unwrap().as_str())
        .unwrap();

    let edit = !matches.is_present("don't edit");
    let luigi = setup_luigi();

    let mut fill_data:HashMap<&str, String> = HashMap::new();

    if let Some(description) = matches.value_of("description"){
        fill_data.insert("DESCRIPTION", description.to_owned());
    }

    if let Some(date) = matches.value_of("date"){
        fill_data.insert("DATE-EVENT", date.to_owned());
    }

    if let Some(time) = matches.value_of("time"){
        fill_data.insert("TIME-START", time.to_owned());
    }

    if let Some(time_end) = matches.value_of("time_end"){
        fill_data.insert("TIME-END", time_end.to_owned());
    }

    if let Some(manager) = matches.value_of("manager"){
        fill_data.insert("MANAGER", manager.to_owned());
    }

    let project = super::execute(|| luigi.create_project(project_name, template_name, &fill_data));
    let project_file = project.file();
    if edit {
        util::pass_to_command(&editor, &[project_file]);
    }
}

#[deprecated(note="move to impl ListMode and then to asciii::actions")]
fn decide_mode(simple:bool, verbose:bool, paths:bool,nothing:bool, csv:bool) -> ListMode{
    if csv{     ListMode::Csv }
    else if nothing{ ListMode::Nothing }
    else if paths{   ListMode::Paths }
    else {
        match (simple, verbose, CONFIG.get_bool("list/verbose")){
            (false, true,  _   ) => {debug!("-v overwrites config"); ListMode::Verbose },
            (false,    _, true ) => {debug!("-v from config");ListMode::Verbose},
                          _      => {debug!("simple mode");ListMode::Simple},
        }
    }
}


/// Command LIST
pub fn list(matches:&ArgMatches){
    if matches.is_present("templates"){
        list_templates();
    } else if matches.is_present("years"){
        list_years();
    } else if matches.is_present("virtual_fields"){
        list_virtual_fields();
    }

    else {
        let list_mode = decide_mode(
            matches.is_present("simple"),
            matches.is_present("verbose"),
            matches.is_present("paths"),
            matches.is_present("nothing"),
            matches.is_present("csv")
            );

        let mut list_config = ListConfig{
            sort_by:   matches.value_of("sort")
                              .unwrap_or_else(||CONFIG.get_str("list/sort")
                                              .expect("Faulty config: field list/sort does not contain a string value")
                                             ),
            mode:      list_mode,
            details:   matches.values_of("details").map(|v|v.collect::<Vec<&str>>()),
            filter_by: matches.values_of("filter").map(|v|v.collect::<Vec<&str>>()),
            show_errors: matches.is_present("errors"),

            ..Default::default()
        };
        //println!("list_config: {:#?}", list_config);

        // list archive of year `archive`
        let dir =
            if let Some(archive_year) = matches.value_of("archive"){
                let archive = archive_year.parse::<i32>().unwrap();
                StorageDir::Archive(archive)
            }

            else if let Some(archive_year) = matches.value_of("year"){
                let archive = archive_year.parse::<i32>().unwrap();
                StorageDir::Year(archive)
            }

            // or list all, but sort by date
            else if matches.is_present("all"){
                // sort by date on --all of not overriden
                if !matches.is_present("sort"){ list_config.sort_by = "date" }
                StorageDir::All }

            // or list normal
            else { StorageDir::Working };

        if matches.is_present("broken"){
            list_broken_projects(dir);
        } else {
            list_projects(dir, &list_config);
        }
    }
}

/// Command LIST [--archive, --all]
///
/// This interprets the `ListConfig` struct and passes it on to either
///
/// * `print::rows()`
/// * `print::simple_rows()`
/// * `print::verbose_rows()`
///
/// which it prints with `print::print_projects()`
fn list_projects(dir:StorageDir, list_config:&ListConfig){
    let luigi = if CONFIG.get_bool("list/gitstatus"){
        setup_luigi_with_git()
    } else {
        setup_luigi()
    };
    debug!("listing projects: {}", luigi.working_dir().display());

    let mut projects = super::execute(||luigi.open_projects(dir));

    // filtering, can you read this
    if let Some(ref filters) = list_config.filter_by{
        projects.filter_by_all(filters);
    }

    // sorting
    match list_config.sort_by {
        "manager" => projects.sort_by(|pa,pb| pa.manager().cmp( &pb.manager())),
        "date"    => projects.sort_by(|pa,pb| pa.date().cmp( &pb.date())),
        "name"    => projects.sort_by(|pa,pb| pa.name().cmp( &pb.name())),
        "index"   => projects.sort_by(|pa,pb| pa.index().unwrap_or("zzzz".to_owned()).cmp( &pb.index().unwrap_or("zzzz".to_owned()))), // TODO rename to ident
        _         => projects.sort_by(|pa,pb| pa.index().unwrap_or("zzzz".to_owned()).cmp( &pb.index().unwrap_or("zzzz".to_owned()))),
    }

    // fit screen
    let wide_enough = true;

    if !wide_enough && list_config.mode != ListMode::Csv { // TODO room for improvement
        print::print_projects(print::simple_rows(&projects, list_config));
    } else {
        debug!("list_mode: {:?}", list_config.mode );
        match list_config.mode{
            ListMode::Csv     => print::print_csv(&projects),
            ListMode::Paths   => print::print_projects(print::path_rows(&projects, list_config)),
            ListMode::Simple  => print::print_projects(print::simple_rows(&projects, list_config)),
            ListMode::Verbose => print::print_projects(print::verbose_rows(&projects,list_config)),
            ListMode::Nothing => print::print_projects(print::dynamic_rows(&projects,list_config)),
        }
    }
}

/// Command LIST --broken
fn list_broken_projects(dir:StorageDir){
    let luigi = setup_luigi();
    let invalid_files = super::execute(||luigi.list_project_files(dir));
    let tups = invalid_files
        .iter()
        .filter_map(|dir| Project::open(dir).err().map(|e|(e, dir)) )
        .collect::<Vec<(StorageError,&PathBuf)>>();

    for (err,path) in tups{
        println!("{}: {:?}", path.display(), err);
    }
}

/// Command LIST --templates
fn list_templates(){
    let luigi = setup_luigi();

    for name in super::execute(||luigi.list_template_names()){
        println!("{}", name);
    }
}

/// Command LIST --years
fn list_years(){
    let luigi = setup_luigi();
    let years = super::execute(||luigi.list_years());
    println!("{:?}", years);
}

/// Command LIST --virt
fn list_virtual_fields(){
    println!("{:?}", VirtualField::iter_variant_names().filter(|v|*v!="Invalid").collect::<Vec<&str>>());
}


/// Command CSV
pub fn csv(matches:&ArgMatches){
    use chrono::{Local,Datelike};
    let year = matches.value_of("year")
        .and_then(|y|y.parse::<i32>().ok())
        .unwrap_or(Local::now().year());

    debug!("asciii csv --year {}", year);
    let csv = super::execute(||actions::csv(year));
    println!("{}", csv);
}


/// Command EDIT
pub fn edit(matches:&ArgMatches) {
    let search_term = matches.value_of("search_term").unwrap();
    let search_terms = matches.values_of("search_term").unwrap().collect::<Vec<&str>>();

    let editor = matches.value_of("editor")
        .or( CONFIG.get("editor").and_then(|e|e.as_str()));

    if matches.is_present("template"){
        edit_template(search_term, &editor);

    } else if let Some(archive) = matches.value_of("archive"){
        let archive = archive.parse::<i32>().unwrap();
        edit_projects(StorageDir::Archive(archive), &search_terms, &editor);
    } else {
        edit_projects(StorageDir::Working, &search_terms, &editor);
    }
}

fn edit_projects(dir:StorageDir, search_terms:&[&str], editor:&Option<&str>){
    let luigi = setup_luigi();
    let mut all_projects= Vec::new();
    for search_term in search_terms{
        let mut paths = super::execute(||luigi.search_projects(dir, search_term));
        if paths.is_empty(){
            //println!{"Nothing found for {:?}", search_term}
        } else {
            all_projects.append(&mut paths);
        }
    }

    if all_projects.is_empty(){
        fail(format!("Nothing found for {:?}", search_terms));
    } else {
        let all_paths = all_projects.iter().map(|p|p.file()).collect::<Vec<PathBuf>>();
        util::pass_to_command(&editor, &all_paths);
    }
}

/// Command EDIT --template
fn edit_template(name:&str, editor:&Option<&str>){
    let luigi = setup_luigi();
    let template_paths = super::execute(||luigi.list_template_files())
        .into_iter() // drain?
        .filter(|f|f.file_stem() .unwrap_or_else(||OsStr::new("")) == name)
        .collect::<Vec<PathBuf>>();
    util::pass_to_command(editor, &template_paths);
}


/// Command SHOW
pub fn show(matches:&ArgMatches){
    let search_term = matches.value_of("search_term").unwrap();

    let dir = match matches.value_of("archive"){
        Some(year) => StorageDir::Archive(year.parse::<i32>().unwrap()),
        _ => StorageDir::Working,
    };

    if matches.is_present("files"){
        with_projects(dir, search_term,
                      |p| {
                          println!("{}: ", p.dir().display());
                          for entry in fs::read_dir(p.dir()).unwrap(){
                              println!("  {}", entry.unwrap().path().display())
                          }
                      }
                     );
    } else if let Some(detail) = matches.value_of("detail"){
        show_detail(dir, &search_term, detail);
    } else if matches.is_present("dump"){ dump_yaml(dir, &search_term)
    } else if matches.is_present("json"){ show_json(dir, &search_term)
    } else if matches.is_present("template"){ show_template(search_term);
    } else { with_projects(dir, search_term, print::show_items) }
}

fn dump_yaml(dir:StorageDir, search_term:&str){
    with_projects(dir, search_term, |p| println!("{}", p.yaml().dump().unwrap()));
}

#[cfg(feature="document_export")]
fn show_json(dir:StorageDir, search_term:&str){
    with_projects(dir, search_term, |p|println!("{}", p.to_json()));
}

fn show_detail(dir:StorageDir, search_term:&str, detail:&str){
    with_projects(dir, search_term, |p| println!("{}", p.get(detail).unwrap()));
}

#[cfg(not(feature="document_export"))]
fn show_json(_:StorageDir, _:&str){
    error!("feature temporarily disabled")
}

/// Command SPEC
/// TODO make this not panic :D
/// TODO move this to `spec::all_the_things`
pub fn spec(_:&ArgMatches){
    super::execute(||actions::spec())
}

/// Command MAKE
#[cfg(feature="document_export")]
#[allow(unused_variables)]
pub fn make(m:&ArgMatches) {
    let search_term = m.value_of("search_term").unwrap();
    let template_name = m.value_of("template").unwrap_or("document");
    let bill_type = match (m.is_present("offer"),m.is_present("invoice")) {
        (true,true)  => unreachable!("this should have been prevented by clap-rs"),
        (true,false) => Some(BillType::Offer),
        (false,true) => Some(BillType::Invoice),
        (false,false) => None
    };
    let dir = match m.value_of("archive"){
        Some(year) => { let year = year.parse::<i32>().unwrap(); StorageDir::Archive(year) },
        _ => StorageDir::Working
    };

    debug!("make {t}({s}/{d:?}, invoice={i:?})",
    d = dir,
    s = search_term,
    t = template_name,
    i = bill_type
    );

    super::execute(||actions::projects_to_tex(dir, search_term, template_name, &bill_type, m.is_present("dry-run"), m.is_present("force")))
}

#[cfg(not(feature="document_export"))]
pub fn make(_:&ArgMatches){
    error!("Make functionality not built-in with this release!");
    unimplemented!();
}

#[deprecated(note="use the actions module")]
fn with_projects<F:Fn(&Project)>(dir:StorageDir, search_term:&str, cb:F){
    trace!("with_projects({})", search_term);
    // TODO make this use ProjectList
    let luigi = setup_luigi();
    let projects = super::execute(||luigi.search_projects(dir, search_term));
    if !projects.is_empty(){
        for project in &projects{
            cb(project);
        }
    } else {
        fail(format!("Nothing found for {:?}", search_term));
    }
}






/// Command SHOW --template
fn show_template(name:&str){
    let luigi = setup_luigi();
    let templater = Templater::from_file(&luigi.get_template_file(name).unwrap()).unwrap();
    println!("{:#?}", templater.list_keywords());
}

/// TODO make this be have like `edit`, taking multiple names
pub fn archive(matches:&ArgMatches){
        let name = matches.value_of("NAME").unwrap();
        let year = matches.value_of("year")
            .and_then(|s|s.parse::<i32>().ok());
        archive_project(name, year, matches.is_present("force"));
}

pub fn unarchive(matches:&ArgMatches){
        let year = matches.value_of("YEAR").unwrap();
        let name = matches.value_of("NAME").unwrap();
        let year = year.parse::<i32>().unwrap_or_else(|e|panic!("can't parse year {:?}, {:?}", year, e));
        unarchive_project(year, name);
}

pub fn config(matches:&ArgMatches){
    if let Some(path) = matches.value_of("show"){
        config_show(path);
    }
    if matches.is_present("location"){
        println!("config location: {:?}", config::ConfigReader::path_home())
    }

    else if matches.is_present("edit"){
        let editor = matches.value_of("editor")
            .or( CONFIG.get("editor").and_then(|e|e.as_str()));
        config_edit(&editor); }

    else if matches.is_present("default"){ config_show_default(); }
}

/// Command ARCHIVE <NAME>
// TODO perhaps move this code out of `::cli`
fn archive_project(name:&str, manual_year:Option<i32>, force:bool){
    let luigi = setup_luigi_with_git();

    debug!("using the force: {}", force);
    if let Ok(projects) = luigi.search_projects(StorageDir::Working, name){
        if projects.is_empty(){ fail(format!("Nothing found for {:?}", name)); }
        for project in &projects {
            if project.is_ready_for_archive().is_ok() || force {
                let year = manual_year.or(project.year()).unwrap();
                println!("archiving {} ({})",  project.ident(), project.year().unwrap());
                let archive_target = super::execute(||luigi.archive_project(project, year));

                if let Some(repo) = luigi.repository{
                    util::exit(repo.add(&[project.dir(),archive_target]));
                };

            }
            else {
                println!("CANNOT archive {} ({})",
                project.ident(), project.file().display());
            }
        }
    }
    else{
        fail(format!("Nothing found for {:?}", name));
    }
}


/// Command UNARCHIVW <YEAR> <NAME>
fn unarchive_project(year:i32, name:&str){
    let luigi = setup_luigi_with_git();
    if let Ok(projects) = luigi.search_projects(StorageDir::Archive(year), name){
        if projects.len() == 1 {
            let project = projects.get(0).unwrap();
            println!("{:?}", project.name());
            let unarchive_target = luigi.unarchive_project(&projects[0]).unwrap();
            if let Some(repo) = luigi.repository{
                util::exit(repo.add(&[project.dir(),unarchive_target]));
            };
        } else{
            fail(format!("Ambiguous: multiple matches: {:#?}", projects.iter().map(|p|p.dir()).collect::<Vec<PathBuf>>() ));
        }
    }
}


/// Command CONFIG --show
pub fn config_show(path:&str){
    println!("{}: {:#?}", path, CONFIG.get(&path)
             .map(|v|v.dump().unwrap_or(String::from("error")))
             .unwrap_or_else(||format!("{} not set", path)));
}

/// Command CONFIG --edit
fn config_edit(editor:&Option<&str>){
    util::pass_to_command(editor, &[&CONFIG.path]);
}

/// Command CONFIG --default
fn config_show_default(){
    println!("{}", config::DEFAULT_CONFIG);
}


/// Command DOC
pub fn doc(){
    open::that("http://hoodie.github.io/asciii-rs/").unwrap();
}

/// Command VERSION
pub fn version(){
    println!("{}", asciii_version());
}

pub fn show_path(matches:&ArgMatches){path(matches, |path| println!("{}", path.display()))}

pub fn open_path(matches:&ArgMatches){path(matches, |path| {open::that(path).unwrap();})}

pub fn path<F:Fn(&Path)>(matches:&ArgMatches, action:F){
    let path = CONFIG.get_str("path").expect("Faulty config: field output_path does not contain a string value");
    let storage_path = CONFIG.get_str("dirs/storage").expect("Faulty config: field output_path does not contain a string value");
    let templates_path = CONFIG.get_str("dirs/templates").expect("Faulty config: field output_path does not contain a string value");
    let output_path = CONFIG.get_str("output_path").expect("Faulty config: field output_path does not contain a string value");

    let exe = env::current_exe().unwrap();

    if matches.is_present("templates"){
        action(&PathBuf::from(path)
               .join(storage_path)
               .join(templates_path
                    ));
    }
    else if matches.is_present("output"){
        action(
            &util::replace_home_tilde(
                Path::new(output_path)
                ));
    }
    else if matches.is_present("bin"){
        action(exe.parent().unwrap());
    }
    else { // default case
        let path = util::replace_home_tilde(Path::new(path))
            .join( storage_path );
        action(&path);
    }
}



/// Command LOG
pub fn git_log(){
    let luigi = setup_luigi_with_git();
    let repo = luigi.repository.unwrap();
    util::exit(repo.log()) // FIXME this does not behave right
}

/// Command STATUS
pub fn git_status(){
    let luigi = setup_luigi_with_git();
    let repo = luigi.repository.unwrap();
    util::exit(repo.status()) // FIXME this does not behave right
}

/// Command COMMIT
pub fn git_commit(){
    let luigi = setup_luigi_with_git();
    let repo = luigi.repository.unwrap();
    util::exit(repo.commit())
}

/// Command REMOTE
/// exact replica of `git remote -v`
#[cfg(not(feature="git_statuses"))]
pub fn git_remote(){
    let luigi = setup_luigi_with_git();
    luigi.repository.unwrap().remote();
}

/// Command REMOTE
/// exact replica of `git remote -v`
#[cfg(feature="git_statuses")]
pub fn git_remote(){
    let luigi = setup_luigi_with_git();
    let repo = luigi.repository.unwrap().repo;

    for remote_name in repo.remotes().unwrap().iter(){ // Option<Option<&str>> oh, boy
        if let Some(name) = remote_name{
            if let Ok(remote) = repo.find_remote(name){
                println!("{}  {} (fetch)\n{}  {} (push)",
                remote.name().unwrap_or("no name"),
                remote.url().unwrap_or("no url"),
                remote.name().unwrap_or("no name"),
                remote.pushurl().or(remote.url()).unwrap_or(""),
                );
            }else{println!("no remote")}
        }else{println!("no remote name")}
    }
}

/// Command ADD
pub fn git_add(matches:&ArgMatches){
    let luigi = setup_luigi_with_git();
    let search_terms = matches
        .values_of("search_term")
        .unwrap()
        .collect::<Vec<&str>>();

    debug!("adding {:?}", search_terms);


    if matches.is_present("template"){
        let template_paths = super::execute(||luigi.list_template_files())
            .iter()
            .filter(|f|{
                let stem = f.file_stem()
                    .and_then(OsStr::to_str)
                    .unwrap_or("");
                search_terms.contains(&stem)
            })
        .cloned()
            .collect::<Vec<PathBuf>>();
        let repo = luigi.repository.unwrap();
        util::exit(repo.add(&template_paths));
    }

    else {

        let dir = if let Some(archive) = matches.value_of("archive"){
            StorageDir::Archive(archive.parse::<i32>().unwrap())
        } else {
            StorageDir::Working
        };

        let projects = luigi.search_multiple_projects(dir, &search_terms)
            .unwrap()
            .iter()
            .map(|project|project.dir())
            .collect::<Vec<PathBuf>>();

        let repo = luigi.repository.unwrap();
        util::exit(repo.add(&projects));
    }
}

/// Command DIFF
pub fn git_diff(){
    // TODO this doesn't need _with_git
    let luigi = setup_luigi_with_git();
    let repo = luigi.repository.unwrap();
    util::exit(repo.diff())
}

/// Command PULL
pub fn git_pull(){
    // TODO this doesn't need _with_git
    let luigi = setup_luigi_with_git();
    let repo = luigi.repository.unwrap();
    util::exit(repo.pull())
}

/// Command PUSH
pub fn git_push(){
    let luigi = setup_luigi_with_git();
    let repo = luigi.repository.unwrap();
    util::exit(repo.push())
}

/// Command DIFF
pub fn git_stash(){
    let luigi = setup_luigi_with_git();
    let repo = luigi.repository.unwrap();
    util::exit(repo.stash())
}

/// Command DIFF
pub fn git_stash_pop(){
    let luigi = setup_luigi_with_git();
    let repo = luigi.repository.unwrap();
    util::exit(repo.stash_pop())
}

