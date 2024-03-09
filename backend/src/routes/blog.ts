import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    },
    Variables: {
        userId: string
    }
}>();

blogRouter.use('/*', async (c, next) => {
    const jwt = c.req.header("Authorization");
    if(!jwt) {
        c.status(401);
        return c.json({
            error: "unauthorized"
        })
    }
    const token = jwt.split(' ')[1];

    try {
        const payload = await verify(token, c.env.JWT_SECRET);
        if(!payload){
            c.status(401);
            return c.json({
                error: "unauthorized"
            })
        }
        console.log("payload" + payload);
        c.set('userId', payload.id);
        await next();
    } catch (e) {
        console.log("error", e);
        c.status(403);
        return c.json({
            message: "you are not logged"
        })
    }
})


blogRouter.post('/', async (c) => {
    const userId = c.get('userId');
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());

    const body = await c.req.json();
    if(!body){
        return c.json({
            message: "Invalid"
        })
    }

    const post = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: Number(userId)
        }
    })
    console.log(post)
    return c.json({
        id: post.id
    })

})


blogRouter.put('/', async (c) => {
    const userId = c.get('userId');
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());

    const body = await c.req.json();
    if(!body){
        return c.json({
            message: "Invalid"
        })
    }

    const post = await prisma.post.update({
		where: {
			id: body.id,
			authorId: Number(userId)
		},
		data: {
			title: body.title,
			content: body.content
		}
	});
    return c.text('updated post');
})

