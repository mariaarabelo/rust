use std::collections::HashMap;
use std::cell::RefCell;
use ic_cdk::query;
use ic_cdk::update;

thread_local! {
    static RANKING: RefCell<Vec<(String, i32, Vec<i32>)>> = RefCell::new(Vec::new());
    static USER_HIGHSCORES: RefCell<HashMap<String, i32>> = RefCell::new(HashMap::new());
}

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[query]
fn collatz(n: i32) -> Vec<i32> {
    let mut sequence = vec![n];
    let mut num = n;

    while num != 1 {
        num = if num % 2 == 0 { num / 2 } else { 3 * num + 1 };
        sequence.push(num);
    }
    sequence
}

#[update]
fn submit_number(user: String, n: i32) {
    let sequence = collatz(n);
    let length = sequence.len() as i32;

    USER_HIGHSCORES.with(|highscores| {
        let mut highscores = highscores.borrow_mut();
        if let Some(&existing_score) = highscores.get(&user) {
            if length <= existing_score {
                return false;
            }
        }
        highscores.insert(user.clone(), length);
        true
    });

    RANKING.with(|r| {
        let mut ranking = r.borrow_mut();
        ranking.retain(|(u, _, _)| *u != user);
        ranking.push((user.clone(), length, sequence.clone()));
        ranking.sort_by(|a, b| b.1.cmp(&a.1));
        ranking.truncate(10);
    });
}

#[query]
fn get_ranking() -> Vec<(String, i32, Vec<i32>)> {
    RANKING.with(|r| r.borrow().clone())
}

ic_cdk::export_candid!();
