//! Thank you for choosing `asciii`, the new and improved `ascii`.
//!
//!

#![cfg_attr(feature = "manual", feature(external_doc))]
#![cfg_attr(feature = "manual", doc(include = "../manual.md"))]

#![warn(//missing_docs,
        //missing_copy_implementations,
        //missing_debug_implementations,
        unstable_features,
        unused_import_braces,
        )]

#![recursion_limit = "1024"]
#![deny(trivial_casts, trivial_numeric_casts)]

#![warn(unused_import_braces, unused_qualifications)]

//#![feature(alloc_system)]
//extern crate alloc_system;

use lazy_static::lazy_static;

#[cfg(feature="serde")] #[macro_use] extern crate serde_derive;

#[cfg(feature="serialization")] extern crate serde_json;
#[cfg(feature="deserialization")] extern crate serde_yaml;

#[macro_use] extern crate custom_derive;
#[macro_use] extern crate enum_derive;

#[cfg(feature="server")] extern crate itertools;

/// Autogenerated localization macros kudos to [crowbook-intl](https://crates.io/crates/crowbook-intl).
#[macro_use] pub mod localize_macros;

#[cfg(feature="git_statuses")] extern crate git2;

#[macro_use]
pub mod util;
pub mod config;

pub mod project;
pub mod storage;
pub mod print;
pub mod actions;

pub mod templater;

#[cfg(feature="document_export")] pub mod document_export;
#[cfg(feature="server")] pub mod server;

pub use yaml_rust::Yaml;
#[cfg(test)]
#[macro_use] extern crate pretty_assertions;

pub static DOCUMENTATION_URL: &str  = "https://docs.rs/asciii/";

lazy_static!{
    /// Static `ConfigReader` to be able to access the configuration from everywhere.
    pub static ref CONFIG: config::ConfigReader = config::ConfigReader::try_new().unwrap();

    /// Hint for app to point at `asciii::DOCUMENTATION_URL`
    pub static ref DOC_HINT: String = lformat!("Documentation at: {}", DOCUMENTATION_URL);
}

lazy_static! {
    pub static ref VERSION: &'static str = env!("CARGO_PKG_VERSION");
}

#[cfg(not(feature="version_string"))]
lazy_static! {
    /// Human readable, no semantic versioning.
    pub static ref VERSION_VERBOSE: &'static str = env!("CARGO_PKG_VERSION");
    pub static ref VERSION_JSON: String = format!(r#"{{"version": "{}"}}"#, env!("CARGO_PKG_VERSION"));
}

#[cfg(feature="version_string")]
lazy_static! {
    /// Human readable, no semantic versioning.
    pub static ref VERSION_VERBOSE: String = format!("{} - {} ({}, {})",
                                             env!("CARGO_PKG_VERSION"),
                                             env!("GIT_DESCRIPTION"),
                                             env!("BUILD_DATE"),
                                             env!("PROFILE"),
                                             );

    /// Human readable, no semantic versioning.
    pub static ref VERSION_JSON: String = format!(
        r#"{{ "version": "{version}", "commit": "{commit}", "built": "{built}", "profile": "{profile}" }}"#,
        version = env!("CARGO_PKG_VERSION"),
        commit = env!("GIT_DESCRIPTION"),
        built = env!("BUILD_DATE"),
        profile = env!("PROFILE"),
    );
}