## :gear: Tech Stack 🚀

[![React JS](https://skillicons.dev/icons?i=react "React JS")](https://react.dev/ "React JS") [![Redux](https://skillicons.dev/icons?i=redux "Redux")](https://redux.js.org/ "Redux") [![Node JS](https://skillicons.dev/icons?i=nodejs "Node JS")](https://nodejs.org/ "Node JS") [![Express JS](https://skillicons.dev/icons?i=express "Express JS")](https://expressjs.com/ "Express JS") [![Tailwind CSS](https://skillicons.dev/icons?i=tailwind "Tailwind CSS")](https://tailwindcss.com/ "Tailwind CSS") [![Material UI](https://skillicons.dev/icons?i=mui "Material UI")](https://mui.com/ "Material UI") [![MongoDB](https://skillicons.dev/icons?i=mongodb "MongoDB")](https://www.mongodb.com/ "MongoDB") [![Docker](https://skillicons.dev/icons?i=docker "Docker")](https://www.docker.com/ "Docker")

## <a name="quick-start">️🎨 Quick Start ✨</a>

Follow these steps to set up the project locally on your machine.

**🔧 Prerequisites**

Make sure you have the following installed on your machine:

- 🛠️ [Git](https://git-scm.com/)
- 🟢 [Node.js](https://nodejs.org/en)
- 🐳 [Docker](https://www.docker.com/)

**📂 Cloning the Repository**

```bash
git clone https://github.com/enyan27/nhomH_ChuyenDeWeb_CT3_NH24-25.git
```

**📦 Installation**

### Client

```bash
cd client
npm install
```

### Server

```bash
cd server
npm install
```

**🔑 Set Up Environment Variables**

Create a new file named `.env` in the `server` directory and add the following content:

```env
# JWT
URL_CLIENT=
JWT_SECRET=

# MongoDB
MONGO_DB_USER=
MONGO_DB_PASSWORD=

# Cloudinary
CLOUDINARY_API_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Replace the placeholder values with your actual credentials.

**🚀 Running the Project**

1. Open a terminal window and run the client:
    ```bash
    cd client
    npm run dev
    ```

2. Open another terminal window and run the server:
    ```bash
    cd server
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

**🐳 Using Docker**

To run the project using Docker, follow these steps:

1. Build and run the Docker containers:
    ```bash
    docker-compose up --build
    ```

2. The client will be available at [http://localhost:3000](http://localhost:3000) and the server at [http://localhost:8080](http://localhost:8080).
