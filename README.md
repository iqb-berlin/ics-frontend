# CodingServiceFrontend

# Deploy Prod

The coding service frontend can be used for one or many coding services which have an API following the [specification](https://github.com/iqb-specifications/coding-service).
It's best deployed with the [iqb-infrastructure](ttps://github.com/iqb-berlin/traefik) project but not necessarily. 

Quick guide how to deploy:

1. Install & run [iqb-infrastructure](ttps://github.com/iqb-berlin/traefik)
2. Configure Frontend 
   1. .env file for application deployment: ```cp .ics-frontend.template.env .ics-frontend.env```
   2. config file to set up services ```cp config/config.template.json config/config.json```
3. configure keycloak via UI; set up frontend and services  
4. Run frontend: ```make run-prod```
