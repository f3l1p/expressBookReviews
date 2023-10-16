# express book api

Book api with express

## Run the project

Install the dependencies
>npm install

run the project

> npm run start


## test it

I recommend you do it with postman. The sever will run on
> localhost:5000/

## routes
### general users:
**all books** 
>GET localhost:5000/

**search book by isbm** 
> GET localhost:5000/isbn/1
> 

**search book by author** 
> GET localhost:5000/author/Unknown
> 
**search book with title** 
> GET localhost:5000/title/The Epic Of Gilgamesh
> 
**register user** 
> POST localhost:5000/register
>{
> "username": "your_username",
>"password": "your_password"
>}
