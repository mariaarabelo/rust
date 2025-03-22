#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}


// query for collatz
#[ic_cdk::query]
fn collatz(n: i32) -> Vec<i32> {
    let mut sequence = vec![n];
    let mut num = n;

    while num != 1 {
        num = if num % 2 == 0 { num / 2 } else { 3 * num + 1 };
        sequence.push(num);
    }

    sequence
}

ic_cdk::export_candid!();