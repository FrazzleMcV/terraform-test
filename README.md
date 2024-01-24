The project is split into 2 seperate areas

OPs is the terraform config.
This creates and S3 bucket for the web app and a dynamodb for the backend.
An API gateway is created to access the lambdas (create elsewhere) and the relevant permissions are created for lambda invocations
At a point an attempt was made to serve the API gateway and the S3 website through Cloudfront, but that was deemed overly complex for the required solution

As per the spec the Packages folder contains the code for the front end as well the lambdas to create and read blog entries
The lambdas are created using Serverless so their lifecycle is outside of terraform. 
Retrospectivley they would have been as part of the terraform config as this would have allowed for much neater management of app state as well as cleaner referencing where other parts of the system needed to refer to the lambdas.

In terms of refactoring or productionisng the first steps would be to proeprly set up the AWS enviroment to ensure much greater levels of security. This would include VPCs and much more fine grained IAM permissions.
Further to this as the terraform was based on examples the naming convention is inconsistent and requires much rework to allow for greater readbility.
