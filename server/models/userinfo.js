const mongoose = require("mongoose");
const { Schema } = mongoose;

const userInfoSchema = new Schema({
	id: {
        type: String,
        required: true,
        unique: true
    },
	avatar_url: {
        type: String,
        required: true
    },
	name: {
        type: String,
        required: true,
        unique: true
    },
	company: String,
	blog: String,
	location: String,
	email: {
        type: String,
        required: true,
        unique: true
    },
	bio: String,
	github_id: String,
	linkedin_id: String,
	codechef_id: String,
	hackerrank_id: String,
	twitter_id: String,
	medium_id: String,
	repos: [{
		name: String,
		html_url: String,
		description: String,
		updated_at: String
	}]
});

module.exports = mongoose.model('UserInfo', userInfoSchema);