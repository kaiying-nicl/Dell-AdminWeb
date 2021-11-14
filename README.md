# Dell-AdminWeb
[API project](https://github.com/kaiying-nicl/Dell-AdminWeb-API)

Choice of Frameworks
----------------------
### Angular (Frontend)
* Component-based
* Clear architecture with flexibility to extend and can expect lower code duplication
### Entity Framework Core (Db)
* Design db architecture closely to objects' relationship in application
* LINQ support to do simple queries to db

3rd party Packages
------------------
### Bootstrap
* Easy to setup with lots of components and layouts design ready to use
* Responsive
### Moq.AutoMocker
* Automatically create a mock for each dependency when creating an instance of a class
* Decouple unit tests changes to class constructor arguments

Assumptions
--------------
* Authentication & Authorization layer:  
Should have existing Service that we can integrate into this project

Improvements / Better approach
----------
* Negative unit test cases
* Error/Exception Handling
* Use a more solid database provider like SQL Server
* Use Builder pattern for object creation, especially useful in unit tests to mock objects & reduce duplication
* Have a separate 'UI' to handle Keyword management.  Current design has both keyword & document mapping arrangement in one page.
* Logging: Track record/data changes (requires authentication & db change to include username), monitor application status
