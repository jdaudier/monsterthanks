# Monster Thanks

### Live site: [monsterthanks.com](http://monsterthanks.com)

### Description:
Monster Thanks is an interactive group thank you card that enables _real-time_ collaboration among multiple participants.

![Monster Thanks](https://dl.dropboxusercontent.com/u/125982/monster-thanks-screenshot.png)
### Steps:
1. Start a card
2. Drag a monster from the closet.
3. Drop it on the card background above.
4. Click ![left arrow](http://goo.gl/PeQf6E) or ![right arrow](http://goo.gl/uJy6OR) to change the background.
5. Resize a monster by dragging the handle on its bottom right.
6. Double click on a monster to activate the speech bubble.
7. Write your thank you message.
8. Double click on the speech bubble if you need to edit it.
9. Share the link with friends so everyone can write on the card.
10. Send the link to the recipient. Have fun!

### Client-Side
* jQuery
* Handlebars
* Stylus

### Server-Side
* Node
* Express
* Jade
* MongoDB
* Mongoose

### Client-Server Communication
* Web sockets (Sockets.io)

### Bonus (if I have time)
* Recipient has a different view
* Ability to change out the font style for "A monster thanks from all of us" header message
* Copy link feature (like GitHub)
* Send email with link to other participants
* Send email with link to recipient
* Ability to delete a monster

### Questions:
1. __SOLVED:__ How do I load the monster (along with the position and message bubble) that someone else has created before me?
2. __SOLVED:__ Is it hard to make it real-time where I can see when someone else is adding stuff (like Google docs)?
3. __SOLVED:__ How do I auto save?
4. __SOLVED:__ I can't figure out how to resize a SVG (together with dragging).
5. __UNSOLVED:__ I can't figure out how to drag an item outside of its parent div (to the right side of the page)