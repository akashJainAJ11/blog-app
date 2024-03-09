import { Hono } from 'hono'
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';


const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
    JWT_SECRET: string
	}
}>();

app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter);


// app.post('/api/v1/user/signup', (c) => {
//   return c.text('Hello Hono!')
// })

// app.post('/api/v1/user/signin', (c) => {
//   return c.text('Hello Hono!')
// })


// app.post('/api/v1/blog', (c) => {
//   return c.text('Hello Hono!')
// })

// app.delete('/api/v1/blog/:id', (c) => {
//   return c.text('Hello Hono!')
// })

// app.put('/api/v1/blog/:id', (c) => {
//   return c.text('Hello Hono!')
// })

// app.get('/api/v1/blog/:id', (c) => {
//   return c.text('Hello Hono!')
// })

// app.get('/api/v1/blogs', (c) => {
//   return c.text('Hello Hono!')
// })


// app.get('/api/v1/categories', (c) => {
//   return c.text('Hello Hono!')
// })

// app.get('/api/v1/categories/:id', (c) => {
//   return c.text('Hello Hono!')
// })

// app.post('/api/v1/categories', (c) => {
//   return c.text('Hello Hono!')
// })

// app.put('/api/v1/categories/:id', (c) => {
//   return c.text('Hello Hono!')
// })


// app.delete('/api/v1/categories/:id', (c) => {
//   return c.text('Hello Hono!')
// })



export default app
