# Project1

## Motivations for the Project
* There are many schools throughout the Seattle area and it can be tough to decide where to move, especially having school-aged children
* Our site will allow users to find information about the school based on the  zip code area where they may be looking for houses. This would help them to determine if this area is a good fit for for their needs. 
* This is important because it would allow parents to make informed decisions regarding where their children will attend school – they can contact the school with any questions, can be directed to the school site, see the location in proximity to where they may be living, etc.

## Design Process
* First we began by pulling in the Leaflet library, along with the Open Street Map API – this allowed us to be able to at least see if what we were coding would show up on the map and provided a good starting point
* Then we made the side table that allowed a user to check boxes for the different school types and allowed the user to type in their zip code
* We then added in the school data API and synched it with the maps by neighborhood
* We added the feature that allows the user to type in zip code, hit “submit” and display results based on what they typed
* Lastly, we added in the CSS design to make the site more attractive to the user

## APIs
Two APIs used: 
### 1: Seattle School Data API
This API pulled in the information contained within each marker on the map – coordinates of school, zip code of school, name, phone number and website
### 2: Open Street Map API
This API was used to display the map to the user – when integrated with the Seattle School Data API, it allowed us to display markers on a map the user can click on to find information about schools located within their zip code


### Link to Map:
https://silvershan.github.io/Project1/
