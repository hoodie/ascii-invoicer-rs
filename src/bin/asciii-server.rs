#![feature(plugin, custom_derive)]
#![plugin(rocket_codegen)]

extern crate asciii;
extern crate serde;
extern crate serde_json;
#[macro_use] extern crate serde_derive;
#[macro_use] extern crate log;
#[macro_use] extern crate lazy_static;
extern crate linked_hash_map;
extern crate itertools;

extern crate rocket;
extern crate rocket_contrib;
extern crate base64;
extern crate openssl_probe;
extern crate rocket_cors;

use rocket::http::Method;
use rocket::Outcome;
use rocket::http::Status;
use rocket::request::{self, Request, FromRequest};
use rocket::response::content;
use rocket_cors::{AllowedOrigins, AllowedHeaders};

use asciii::actions;

use std::sync::Mutex;
use std::sync::mpsc::{sync_channel, SyncSender};
use std::thread;

lazy_static! {
    pub static ref PROJECTS: Mutex<server::ProjectLoader> = Mutex::new(server::ProjectLoader::new());

    pub static ref CHANNEL: SyncSender<()> = {
        let (tx, rx) = sync_channel::<()>(1);

        thread::spawn(move || {
            println!("background thread");
            let mut count = 0;
            loop {
                rx.recv().unwrap();
                count += 1;
                if count % 6 == 0 {
                    debug!("updating projects");
                    PROJECTS.lock().unwrap().update();
                }
                debug!("callcount: {}", count);
            }
        });
        tx
    };
}

mod server {
    use itertools::Itertools;
    use linked_hash_map::LinkedHashMap;

    use asciii::project::Project;
    use asciii::storage::{self, ProjectList, Storage, StorageDir, Storable};

    use std::convert::TryInto;

    pub struct ProjectLoader {
        pub(crate) storage: Storage<Project>,
        pub(crate) years: Vec<i32>,
        pub(crate) projects_all: ProjectList<Project>,
        pub(crate) projects_map: LinkedHashMap<String, Project>,
    }

    impl<'a> ProjectLoader {
        pub fn new() -> Self {

            let storage = storage::setup().unwrap();
            let projects_all = storage.open_projects(StorageDir::All).unwrap();
            let projects_map = storage.open_projects(StorageDir::All)
                .unwrap()
                .into_iter()
                .map(|p| (format!("{}-{}",
                                Storable::year(&p).unwrap(),
                                Storable::ident(&p)),
                                p))
                .collect();
            let years = projects_all.iter()
                                        .filter_map(|p: &Project| p.year())
                                        .unique()
                                        .collect::<Vec<_>>();

            Self {
                storage,
                years,
                projects_all,
                projects_map,
            }
        }

        pub fn update(&mut self) {
            debug!("updating projects");
            self.projects_all = self.storage.open_projects(StorageDir::All).unwrap();
        }
    }

    #[derive(FromForm, Debug)]
    pub struct Dir {
        pub year: Option<i32>,
        pub all: Option<bool>,
    }

    impl TryInto<StorageDir> for Dir {
        type Error = String;

        fn try_into(self) -> Result<StorageDir, Self::Error> {
            let dir = match self {
                Dir{ all: Some(true), year: None } => StorageDir::All,
                Dir{ all: Some(true), year: Some(_) } => return Err("Ambiguous".into()),
                Dir{ all: None, year: Some(year) } => StorageDir::Archive(year),
                Dir{ all: None, year: None } => StorageDir::Working,
                _ => StorageDir::Working,
            };
            Ok(dir)
        }
    }


    pub mod endpoints {
        use rocket::response::NamedFile;
        use std::path::{Path, PathBuf};

        #[get("/<file..>", rank=5)]
        pub fn static_files(file: PathBuf) -> Option<NamedFile> {
            NamedFile::open(Path::new("static/").join(file)).ok()
        }

        pub mod calendar {
            use super::super::Dir;

            use rocket::response::content::{self, Content};
            use rocket::http::ContentType;

            use asciii::actions;

            use std::convert::TryInto;

            #[get("/", rank=2)]
            fn cal(api_key: ApiKey) -> Result<content::Content<String>, String> {
                cal_params(Dir{ year:None, all:None })
            }

            #[get("/", rank=2)]
            fn cal_plain(api_key: ApiKey) -> Result<content::Plain<String>, String> {
                cal_plain_params(Dir{ year:None, all:None })
            }

            #[get("/?<dir>", rank=1)]
            fn cal_params(api_key: ApiKey, dir: Dir) -> Result<content::Content<String>, String> {
                let storage_dir = dir.try_into()?;

                actions::calendar(storage_dir)
                    .map(|s| Content(ContentType::new("text", "calendar"),s) )
                    .map_err(|_|String::from("error"))
            }

            #[get("/?<dir>", rank=1)]
            fn cal_plain_params(api_key: ApiKey, dir: Dir) -> Result<content::Plain<String>, String> {
                let storage_dir = dir.try_into()?;
                actions::calendar(storage_dir)
                    .map(|s| content::Plain(s) )
                    .map_err(|_|String::from("error"))

            }
        }

        pub mod projects {
            use linked_hash_map::LinkedHashMap;
            use asciii::project::export::Complete;
            use asciii::project::export::ExportTarget;
            use asciii::storage::{Storable, Year};
            use serde_json;
            use rocket::response::content;
            use ::ApiKey;

            #[get("/projects/year")]
            fn years(api_key: ApiKey) -> content::Json<String> {
                ::CHANNEL.send(()).unwrap();
                let loader = ::PROJECTS.lock().unwrap();
                content::Json(serde_json::to_string(&loader.years).unwrap())
            }

            #[get("/full_projects/year/<year>")]
            fn full_by_year(api_key: ApiKey, year: Year) -> content::Json<String> {
                ::CHANNEL.send(()).unwrap();
                let loader = ::PROJECTS.lock().unwrap();
                let exported = loader.projects_map.iter()
                    .filter(|&(_, p)| if let Some(y) = Storable::year(p) {y == year } else {false})
                    .map(|(ident, p)| {
                        let exported: Complete = p.export();
                        (ident.clone(), exported)
                    })
                    .collect::<LinkedHashMap<String, Complete>>();

                content::Json(serde_json::to_string(&exported).unwrap())
            }

            #[get("/projects/year/<year>")]
            fn by_year(api_key: ApiKey, year: Year) -> content::Json<String> {
                ::CHANNEL.send(()).unwrap();
                let loader = ::PROJECTS.lock().unwrap();
                let exported = loader.projects_map.iter()
                    .filter(|&(_, p)| if let Some(y) = Storable::year(p) {y == year } else {false})
                    .map(|(ident, _)| ident.as_str())
                    .collect::<Vec<&str>>();

                content::Json(serde_json::to_string(&exported).unwrap())
            }

            #[get("/full_projects")]
            fn all_full(api_key: ApiKey) -> content::Json<String> {
                let loader = ::PROJECTS.lock().unwrap();
                let list = loader.projects_map.iter()
                                .map(|(ident, p)| {
                                    let exported: Complete = p.export();
                                    (ident, exported)
                                })
                                .collect::<LinkedHashMap<_,_>>();

                content::Json(serde_json::to_string(&list).unwrap())
            }

            #[get("/projects")]
            fn all_names(api_key: ApiKey) -> content::Json<String> {
                let loader = ::PROJECTS.lock().unwrap();
                let list = loader.projects_map.iter()
                                .map(|(ident, _)| ident)
                                .collect::<Vec<_>>();

                content::Json(serde_json::to_string(&list).unwrap())
            }

            #[get("/projects/<name>")]
            fn by_name(api_key: ApiKey, name: String) -> Option<content::Json<String>> {
                let loader = ::PROJECTS.lock().unwrap();
                let list = loader.projects_map.iter()
                                .map(|(ident, p)| {
                                    let exported: Complete = p.export();
                                    (ident, exported)
                                })
                                .collect::<LinkedHashMap<_,_>>();

                list.get(&name)
                    .map(|p| content::Json(serde_json::to_string( p).unwrap()))
            }
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub enum ApiKey {
    Key(String),
    UsernamePassword(String, String),
}

impl<'a, 'r> FromRequest<'a, 'r> for ApiKey {
    type Error = ();
    fn from_request(request: &'a Request<'r>) -> request::Outcome<ApiKey, ()> {
        let auth = request
            .headers()
            .get("Authorization")
            .nth(0)
            .map(|s| s.split_whitespace().nth(1).unwrap())
            .and_then(|s| base64::decode(s.as_bytes()).ok())
            .and_then(|v| String::from_utf8(v).ok())
            .map(|s| s.split(':').map(ToOwned::to_owned).collect::<Vec<_>>());

        if let Some(auth) = auth {
            let authorization = match (auth.get(0), auth.get(1)) {
                (Some(user), Some(pass)) => ApiKey::UsernamePassword(user.to_owned(), pass.to_owned()),
                _ => return Outcome::Failure((Status::BadRequest, ()))
            };

            if validate_authorization(&authorization) {
                Outcome::Success(authorization)
            } else {
                Outcome::Failure((Status::Unauthorized, ()))
            }
        } else {
            error!("{:#?}", request);
            Outcome::Failure((Status::BadRequest, ()))
        }
    }
}

fn validate_authorization(given_key: &ApiKey) -> bool {
    // TODO: load keys at const intervals
    let users = match actions::meta_store::get_api_keys() {
        Ok(keys) => keys.users,
        Err(e) => {error!("{}", e); return false},
    };
    match *given_key {
        ApiKey::Key(_) => false,
        ApiKey::UsernamePassword(ref user, ref password) => {
            users.iter().any(|(u, p)| u == user && p == password)
        }
    }
}

#[get("/authorization")]
fn authorization(api_key: ApiKey) -> content::Json<String> {
    content::Json(serde_json::to_string(&api_key).unwrap())
}

fn main() {
    openssl_probe::init_ssl_cert_env_vars();

    use server::endpoints;
    use server::endpoints::{calendar, projects, static_files};

    let server = rocket::ignite()
        .mount("/", routes![endpoints::static_files]) // TODO: might be a rocket bug
        .mount("/cal/plain", routes![calendar::cal_plain, calendar::cal_plain_params])
        .mount("/cal", routes![calendar::cal, calendar::cal_params])
        .mount("/api", routes![projects::years,
                               projects::by_year,
                               projects::full_by_year,
                               projects::all_names,
                               projects::all_full,
                               projects::by_name,
                               authorization,
        ]);

    if let Ok(env_cors) = std::env::var("CORS_ALLOWED_ORIGINS") {

        println!("Adding CORS Data {}",env_cors);
        let env_allowed_origins = &[env_cors.as_str()];
        let (allowed_origins, failed_origins) = AllowedOrigins::some(env_allowed_origins);
        assert!(failed_origins.is_empty());
        let options = rocket_cors::Cors {
            allowed_origins: allowed_origins,
            allowed_methods: vec![Method::Get].into_iter().map(From::from).collect(),
            allowed_headers: AllowedHeaders::some(&["Authorization", "Accept"]),
            allow_credentials: true,
            ..Default::default()
        };

        server.attach(options)
    } else {
        server
    }.launch();

}
