import { pgTable, serial, text, boolean, date} from "drizzle-orm/pg-core";

const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: text('username').notNull(),
    email: text('email').notNull(),
    password: text('password').notNull(),
    fname: text('fname').notNull(),
    lname: text('lname').notNull(),
    active: boolean('active').notNull(),
    created_at: date('created_at').notNull(), 
    updated_at: date('updated_at').notNull(), 
})

export default users;