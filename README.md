# TASKS CRUD
Tasks Project,
https://github.com/ferasMoh/crud-Frontend

## Description
This is an CRUD project and its talking about an admin who distributes tasks to his users,
We divided the project into two parts ( admin part and user part ),
admin part call it by this command ( ng serve admin ),
   Port : 3000  ,   Link : http://localhost:3000/ ,
user part call it by this command ( ng serve user ),
   Port : 4000  ,   Link : http://localhost:4000/ .

## Login
* In admin part we have one admin is already exist,
    email : feras@admin.com,
    password : 12345,


* In user part we have this three users :
    email : ali@user.com,
	password : 12345,
	email : anas@user.com,
	password : 12345,
    email : ahmad@user.com,
	password : 12345,
also you can add more users by go to user part and navigate to register page then fill all fields.


## Tasks
In admin part you can add tasks to users ,
when you add a task all this task data will show inside a mat-table in admin part ,
and when user open his account he will see his tasks inside a html card ,
and when user complete his task he can press on complete button to completed ,
then this task will show as completed Task inside status column in admin part .

## Edit Task
admin can edit tasks by clicking on edit icon and change the data .

## Users
In admin part you can press on Users button to see all users ,
you can delete user from database and change his status ( Active , In-active ),
if user status is In-active then user can't login to his account
if user tasks is not finished his tasks then admin can't delete this user until he finish his tasks.

## Search
In this project you can search for Tasks by name ,username ,date and status,
also you can search for users by name .

## Language
In this project we have two languages to use ( English - Arabic ).


## CRUD

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.7.


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
