use std::env;
use std::cell::RefCell;
use std::thread;
use std::collections::HashMap;


// Determine the length of the collatz sequence beginning at `n`.
fn collatz_length(mut n: i32) -> u32 {
    println!("Calculating collatz sequence for n = {}", n);
    let mut length = 1;

    // store sequence in a vector
    let mut sequence = vec![n];

    while n != 1 {
       if n % 2 == 0 {
           n = n / 2;
       } else {
           n = 3 * n + 1;
       }
        length += 1;
        sequence.push(n);
    }
    // print sequence
    println!("Collatz sequence: {:?}", sequence);
    println!("Length of collatz sequence: {}", length);

    length
}
#[derive(Debug)]
enum UsState {
    Utah,
}

#[derive(Debug)]
enum Coin {

    Quarter(UsState),
    Dime,
}
#[derive(Debug)]
struct Any;


mod outer {
    fn private() {
        println!("outer::private");
    }

    pub fn public() {
        println!("outer::public");
        inner::public();
    }

    mod inner {
        fn private() {
            println!("outer::inner::private");
        }

        pub fn public() {
            println!("outer::inner::public");
            super::private();
            private();
        }
    }
}

#[cfg(test)]
mod tests {
    fn add(a: i32, b: i32) -> i32 {
        a + b
    }

    #[test]
    fn adder_test() {
        let result = add(2, 3);
        assert_eq!(result, 5);
    }

    #[test]
    fn another_test() {
        let result = add(2, 3);
        assert!(result < 0, "result was not less than 0, was {}", result);
    }
}

pub trait Summary {
    fn summarize(&self) -> String {
        String::from("(Read more summarize ...)")
    }
    fn other_method(&self) -> String {
        String::from("Read more other_metod...")
    }
}


pub struct NewsArticle {
    headline: String,
    author: String,
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{} - {}", self.headline, self.author)
    }
}

pub struct NewType{
    pub value: i32,
}
 
impl Summary for NewType {
    fn other_method(&self) -> String {
        format!("Read more about {}", self.value)
    }

}

// Declare a thread-local variable.
thread_local! {
    static FOO: RefCell<u32> = RefCell::new(0);
}

fn main() {
    outer::public();

    let mut s = String::new();
    s.push_str("Hello, ");
    s.push_str("world!");
    println!("{}", s);

    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);
    println!("{:?}", scores);

    let args: Vec<String> = env::args().collect();
    println!("{:?}", args);

    let article = NewsArticle {
        headline: String::from("Penguins win the Stanley Cup Championship!"),
        author: String::from("Iceburgh"),
    };

    println!("New article available! {}", article.summarize());
    let new_type = NewType {
        value: 5,
    };
    println!("New type available! {}", new_type.summarize());

    // Spawn a new thread.
    let handle = thread::spawn(|| {
        // Access and modify the thread-local variable.
        FOO.with(|foo| {
            *foo.borrow_mut() = 1;
            println!("Thread-local value in the spawned thread: {}", foo.borrow());
        });
    });

    // Access and modify the thread-local variable in the main thread.
    FOO.with(|foo| {
        *foo.borrow_mut() = 2;
        println!("Thread-local value in the main thread: {}", foo.borrow());
    });

    // Wait for the spawned thread to finish.
    handle.join().unwrap();

    // Call the `collatz_length` function with the argument 12.
    collatz_length(12);
    let mut coin = Coin::Quarter(UsState::Utah);
    println!("{:?}", coin);
    coin = Coin::Dime;
    println!("{:?}", coin);

    // Use Any
    let a = Any;
    println!("{:?}", a);


}
