# Online-banking-system

This is a web application for online banking with all essential features. It allows registered users to manage their bank accounts, transfer funds, get a list of all past transactions, as well as to pay their bills.


# Logical structure
From a logical point of view, the system has a 3-tiered REST application architecture. It is a modular client-server architecture that consists of a presentation tier, an application tier and a data tier.

Presentation tier:
Communicates with other two tiers and holds GUI. It is built with Angular, HTML, CSS, and a TypeScript as a front-end logic. Communication with the other tiers is established through API calls.

Application tier:
Handles application logic. It is built in .net core (written in C#). Their primary purpose is to support the application’s core functions and fetch/post user data from databases throughout database server calls.

Data tier:
Stores user related information. The data tier consists of a one database servers:

MySQL server and corresponding database, as far as MySQL DBMS. It is used to store users information, their bank account details and all related transaction details.

# Tech Stack

- Angular version 16 (frontend)
- .net core 6.0 (backend)
- git (source control)
- mysql (database)

# Needed Development IDE

###### Node.js and npm

Node.js is required to run the Angular application and manage dependencies using npm. To download and install Node.js, follow these steps:

1. Visit the [Node.js download page.](https://nodejs.org/en/download)
2. Download the LTS (Long Term Support) version for your operating system.
3. Run the installer and follow the installation instructions.

###### Angular CLI

Angular CLI is a command-line tool used to create and manage Angular projects. Install it globally using npm:

Open command prompt and write the below command

npm install -g @angular/cli

###### Download and Install Visual Studio Code

Visual Studio Code is a lightweight, open-source code editor that supports various programming languages.

1. Visit the [Visual Studio Code Download Page.](https://code.visualstudio.com/download)
2. Choose the download link for your operating system (e.g., Windows, macOS, or Linux).
3. Run the downloaded installer.
4. Follow the on-screen instructions to install Visual Studio Code.
5. After the installation is complete, launch Visual Studio Code.

###### Download and Install Visual Studio

Visual Studio is a powerful integrated development environment (IDE) for various programming languages, including C#, C++, and more.

1. Visit the [Visual Studio Download Page.](https://visualstudio.microsoft.com/vs/)
2. Choose the Visual Studio Community edition.
3. Click the "Download" button to begin the download.
4. Run the downloaded installer.
5. Once the installation is complete, launch Visual Studio.

###### Download and Install Git

Git is a version control system that's essential for collaborating on software projects and tracking changes to your code.

1. Visit the [Git Download Page.](https://git-scm.com/downloads)
2. Choose the appropriate download for your operating system (e.g., Windows, macOS, or Linux).
3. Run the downloaded installer.
4. Follow the installation wizard's instructions, leaving the default settings as they are unless you have specific preferences.

###### Download and Install Microsoft SQL Server

Microsoft SQL Server is a powerful and popular relational database management system.

1. Visit the [Microsoft SQL Server Downloads page.](https://www.microsoft.com/en-in/sql-server/sql-server-downloads)
2. Choose the developer edition of SQL Server.
3. Click the "Download now" button to initiate the download.
4. Follow the on-screen instructions to download the SQL Server installation file. 
5. Run the downloaded installer.
6. Follow the installation wizard's instructions, including configuring SQL Server settings such as instance name, authentication mode, and other preferences.
7. Once the installation is complete, SQL Server will be installed on your computer.

###### Download and Install SQL Server Management Studio (SSMS)

SQL Server Management Studio (SSMS) is a graphical user interface for managing SQL Server databases.

1. Visit the [SQL Server Management Studio (SSMS) Download page.](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver16#download-ssms)
2. Select the appropriate SSMS version that matches your SQL Server installation. Ensure that the SSMS version you download is compatible with your SQL Server edition.
3. Click the "Download" button to begin the download.
4. Run the downloaded SSMS installer.
5. Follow the installation wizard's instructions. You can typically leave the default settings as they are, unless you have specific preferences.
6. After the installation is complete, launch SQL Server Management Studio.

# How to run project

##### Download Project 

1. Visit the [github link.](https://github.com/dhruvil132/Banking) 
2. Click the green "Code" button to open the dropdown.
3. Select "Download ZIP" to download the repository as a ZIP file.
4. Once downloaded, extract the contents of the ZIP file to a location of your choice.

##### Open Visual Studio Code for Angular project (frontend):

1. Open Visual Studio Code (VS Code)
2. In VS Code, click on "File" in the top left corner.
3. Select "Open Folder" and navigate to the location where you extracted the downloaded GitHub repository.
4. Choose the frontend folder as it contains the Angular project.
5. Open the integrated terminal in VS Code by clicking "Terminal" > "New Terminal."
6. Run the following command to install the project's dependencies using npm:
npm install --legacy=peer-deps
7. After the completion of the above command, run the following command:
npm start
8. The Angular application should be available at http://localhost:5000/.

##### Open SQL Server Management Studio (SSMS) (database):

1. Open SQL Server Management Studio (SSMS)
2. After launching SSMS, you will need to connect to a SQL Server instance. 
3. In the "Connect to Server" window, you'll see the following fields:
Server Type: Ensure that the "Database Engine" option is selected.
Server Name: Enter the name of the SQL Server instance you want to connect to. This is usually the PC name
Authentication: You need to select "Windows Authentication" 
4. After filling in the necessary connection details, click the "Connect" button.
5. Once connected, you will see the "Object Explorer" on the left-hand side of SSMS. Here, you can navigate through the available databases, server objects, and other components.
6. Navigate to the location where you extracted the downloaded GitHub repository.
7. Follow the folder path as "Banking" > "SQL Query"
8. Right click on Script.no.1.txt and select open with ssms
9. Once the file is opened click on execute.
10. In the "Object Explorer," expand the "Databases" node to see a list of available databases on the connected server. you will now see "bankingsystem"
11. To query the database, click "New Query" in the toolbar or right-click on the database node and choose "New Query."
12. Follow the folder path as "Banking" > "SQL Query"
13. Right click on Script.no.2.txt and select open with ssms
14. Once the file is opened click on execute.
15. Database is now set up
 
##### Open Visual Studio 2022 for .net core project (backend):

1. Navigate to the location where you extracted the downloaded GitHub repository. 
2. Open the "appsettingsfile" folder
3. Copy the "appsettings.Development.json" and go back to folder.
4. Follow the folder path as "Banking" > "api" > "api" and paste the copied file here.
5. Open Visual Studio.
6. Click on open a project or solution.
7. Navigate to the location where you extracted the downloaded GitHub repository.
8. Follow the folder path as "Banking" > "api"
9. Select api.sln file. 
10. Open the solution explorer in VS by clicking "View" > "Solution Explorer."
11. Search for appsettings.Development.json and open it. Change the connection string server name as the server name of your database.
12. Click on "Debug" in the top menu and then click on start debugging.
13. The .net core application should be running at http://localhost:5001/.