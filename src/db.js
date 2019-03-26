const users = [{
        id: '123',
        name: "mohit",
        email: "mohit_test@gmail.com",
        age: 31
    },
    {
        id: '1234',
        name: "shik",
        email: "shik_test@gmail.com",
        age: 30
    },
    {
        id: '12345',
        name: "test",
        email: "test_test@gmail.com"
    }
]

const posts = [{
        id: '1',
        title: `Gist of Sorcerer's stone`,
        body: `first part`,
        published: true,
        author: '123'
    },
    {
        id: '2',
        title: `Gist of chamber of secrets`,
        body: `second part`,
        published: true,
        author: '1234'
    },
    {
        id: '3',
        title: `Gist of prisoner of delhi`,
        body: `third part`,
        published: false,
        author: '12345'
    }
]

const comments = [{
        id: '9',
        text: 'text for id 9',
        author: '1234',
        post: '1'
    },
    {
        id: '99',
        text: 'text for id 99',
        author: '123',
        post: '2'
    },
    {
        id: '999',
        text: 'text for id 999',
        author: '1234',
        post: '3'
    },
    {
        id: '9999',
        text: 'text for id 9999',
        author: '12345',
        post: '1'
    }
]

const db = {
    users,
    posts,
    comments
}

export {db as default}