// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{CustomMenuItem, Manager, Menu, MenuItem, Submenu};

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let close = CustomMenuItem::new("close".to_string(), "Close");
    let submenu = Submenu::new(
        "File".to_string(),
        Menu::new().add_item(close).add_item(quit),
    );
    let menu = Menu::new()
        .add_native_item(MenuItem::Copy)
        .add_item(CustomMenuItem::new("hide", "-"))
        .add_submenu(submenu);

    tauri::Builder::default()
        // only include this code on debug builds
        // .setup(|app| {
        //     #[cfg(debug_assertions)]
        //     {
        //         let window = app.get_window("main").unwrap();
        //         window.open_devtools();
        //         window.close_devtools();
        //     }
        //     Ok(())
        // })
        .setup(|app| {
            let id = app.listen_global("click", |event| {
                println!("got click with payload {:?}", event.payload());
            });
            // app.unlisten(id);

            app.emit_all(
                "click",
                Payload {
                    message: "Tauri is awesome!".into(),
                },
            )
            .unwrap();
            Ok(())
        })
        .menu(menu)
            .on_menu_event(|event| {
                match event.menu_item_id() {
                    "quit" => {
                        std::process::exit(0);
                    }
                    "close" => {
                        event.window().close().unwrap();
                    }
                    "hide" => {
                        event.window().hide().unwrap();
                    }
                    _ => {}
                }
            })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
