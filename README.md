# Turo Rental Car Search Excercise

This repoistory contains a car rental search application called Slim Jim, created for Turo as a code excercise. The name "Slim Jim" is a reference to the car lockout tool of the same name. This is a fitting as the application pulls data from the Hotwire Rental Search API.

## Technologies Used

### Grunt

A JavaScript task runner. I'm using Grunt to:
1.  minify images
2.  lint, concatenate and minify JavaScript
3.  concatenate and process SASS
4.  auto-prefix CSS
5.  auto-reload my browser window with updates during development

### Vagrant

Vagrant is a flexible and easy to use virtual environment to  host the site while developing locally.

### jQuery 3.1.1

I'm using the latest version of jQuery for scripting on the site. It is my most comfortable scripting language and thus a good choice for an excercise on which I will be judged.

### jQuery Validate 1.15.0

jQuery Validate  is a robust jQuery form validation plugin used to validate the rental search form.

### jQuery scrollTo 2.1.2

The jQuery scrollTo plugin allow for smooth anchor scrolling transitions.

### SASS
SASS is my preferred CSS preprocessor. It allows me to separate styling by functional component and create reusable variables, thereby increasing organization and efficiency.

### SVG
All images used on the site (except the Apple Touch Icon) are SVG. They are implemented as such to mazimize site speed.


## Limitations of This Example

### Zip Code-only Location Search
I chose to limit the location search to zip code-only as it was a simple perameter by which the Hotwire API can return results. In a more robust production example, I would add the ability to search by any address value and normalize/validate it with something like the [SmartyStreets API](https://smartystreets.com/).

### Localization
As all of the API requests are made client-site, they use the local machine date and time as a baseline, regardless of the date and time of the lookup location. In a more robust production example, times would be adjusted for the lookup location using a library such as [Moment.js / Moment Timezone](https://momentjs.com/).

### HTML5 Date Input

This examples makes use of the HTML5 "date" input type which, while efficient, is only available in a limited set of browsers. As such, the site is **best viewed in Chrome on desktop** or in native **iOS** or **Android** browsers. In a production site, there would be a javascript fallback using a library like jQuery UI or HTML5 Form Shim. This would be implemented using Modernizr feature detection and load the additional scripts only if required.

![HTML5 Date Input Browser Support](http://maniac.al/slimjim/dist/images/date-input-usage.png "HTML5 Date Input Browser Support")

### Selecting Pick-up Time of Day
For the sake of simplicity, the API call is set to a default pick-up and drop-off time of 23:30. A more robust production example would allow the user to select the time and include the selected time in the API call.


## General Notes

The limitations described above are based on the relatively short (30-120 minute) timeline suggested to complete this exercise, which is a pretty short amount of time in which to build a bulletproof location-sensitive search app. Likewise, based on the timeline, it is very possible that there are additional issus with validation, error handling, etc. that I have not considered. If you would like me to dig deeper into a specific use case or situation, let me know and I'd be happy to update the environment.

In a typical environment I would include instructions for getting both Grunt and the Vagrant environment up and running. For this excercise though, as I am providing both the code and the live example, I did not think it was necessary. If you'd like that information, I'd be happy to provide it.

The Git repo does not include compiled/compressed production code as a best practice. If you'd like access to the production code, it can be found on the live site or I'd be happy to provide it by another means.

Thank you!


## Credits
[Car type images by Freepik](http://www.freepik.com/)

[Tire image by Rohan Gupta from the Noun Project Under Creative Commons License 3.0](https://creativecommons.org/licenses/by/3.0/legalcode)
