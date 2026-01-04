use crate::handlers::check_health;
use crate::handlers::save_page;
use crate::server::{HttpRequest, Method};

pub fn route_request(request: HttpRequest) -> (u16, String) {
    // Take a request and decide what to do
    match (&request.method, request.path.as_deref()) {
        (Some(Method::Get), Some("/health")) => check_health(),
        (Some(Method::Post), Some("/save")) => save_page(request),
        (Some(Method::Options), _) => (200, String::new()),
        _ => (404, String::from("Resource not found")),
    }
}
