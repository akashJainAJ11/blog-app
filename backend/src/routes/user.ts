import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { jwt, sign } from 'hono/jwt'

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    }
}>();

userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());

  const body = await c.req.json();
  const {sucess} = body;
  if(!{sucess}){
    c.status(411);
    return c.json({
      message: "body is not found."
    })
  }
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email
      }
    });
    if(existingUser){
      return c.json({
        error: "Email is already in use"
      });
    }
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        username: body.username
      }
    })
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET)
    return c.json({jwt})
  } catch (e) {
    c.status(403);
    return c.json({
      error: "error while signing up"
    })
  }
})

userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());

  const body = await c.req.json();
  const {sucess} = body;
  if(!{sucess}){
    c.status(411);
    return c.json({
      message: "body is not found."
    })
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
        password: body.password
      }
    })
    if(!user){
      return c.json({
        message: "User not found"
      })
    }
    const jwt = await sign({id: user.id }, c.env.JWT_SECRET)
    return c.json({jwt})
  } catch (e) {
    c.status(403);
    return c.json({
      error: "error while signing in"
    })
  }
})