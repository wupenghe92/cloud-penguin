## cloud-penguin

### The single source of pet
 - Kimi, a penguin that shared by any user.

### Installation
- Install dependencies: `npm install`
- Start mongo database: `sudo mongod`
- Start localhost server: `npm start`
- Transpile react file: `npm run build`
### Descriptions
- Once signed up/logged in, user can feed Kimi.
- [ ] Kimi likes fish, squid, shrimp etc. Food list can be seen in penguin/kimiModel.js
- User can request to play with Kimi when Kimi is not busy. The chance that Kimi also wants to play with the user depends on the friendliness between you and Kimi.
- When Kimi is playing with someone, a user with closer relationship with Kimi can steal Kimi from the user Kimi is playing with. The successful rate depends on the friendliness difference between two users.
