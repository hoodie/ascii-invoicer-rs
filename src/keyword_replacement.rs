use regex::{Regex,Captures};
pub trait IsKeyword {
    fn is_keyword(&self) -> bool;
    fn get_keyword(&self) -> Option<String>;
    fn map_keywords<F>(&self, closure: F) -> String where F:Fn(&str) -> String;// -> Option<String>;
}

static REGEX: &'static str = r"__([0-9A-Z-]*)__*";

impl IsKeyword for str {

    fn is_keyword(&self) -> bool{
        Regex::new(REGEX).ok().expect("broken regex").is_match(self)
    }

    fn get_keyword(&self) -> Option<String> {
        Regex::new(REGEX).ok().expect("broken regex")
            .captures(&self)
            .and_then(|caps| caps.at(1).map(|c| c.to_owned()))
    }

    fn map_keywords<F>(&self, closure: F) -> String
        where F:Fn(&str) -> String{
        Regex::new(REGEX).ok().expect("broken regex")
            .replace_all(&self, |caps:&Captures| {
                closure(caps.at(1).unwrap())
            })
    }
}
