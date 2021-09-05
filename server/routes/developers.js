const express = require('express');
const router = express.Router();
const UserInfo = require('../models/userinfo');

router.get("/:userId",function(req,res){
    let uniqueId = req.params.userId;
    UserInfo.find({"github_id": uniqueId})
    .then(users => {
        res.send(users);
    }, err => {
        console.log(`Error in finding users ${err}`);
    });
});
router.get("/",function(req,res){
    const userlist = [];
    UserInfo.find().then(users => {
        users.forEach(user => {
            let user_value = {};
            user_value["id"] = user.id;
            user_value["avatar_url"] = user.avatar_url;
            userlist.push(user_value);
        })
        res.send(userlist);
    },err => {
        console.log(`Error in finding users ${err}`);
    })
});
router.delete("/:userId",function(req,res){
    let uniqueId = req.params.userId;
    UserInfo.findOneAndDelete({"github_id": uniqueId})
    .then(temp => {
        console.log(temp);
        console.log('Deleted');
        res.send('User Deleted Succesfully');
    },err => {
        console.log(`Error in deleting users ${err}`)
    });
})
function getrepos(repos_data)
{
    repos_data_list = []
    size = repos_data.length
    for(let i=0;i<size;i++)
    {
        repo_detail = {};
        repo_detail["name"] = repos_data[i]["name"];
        repo_detail["html_url"] = repos_data[i]["html_url"];
        repo_detail["description"] = repos_data[i]["description"];
        repo_detail["updated_at"] = repos_data[i]["updated_at"];
        repos_data_list.push(repo_detail);
    } 
    return repos_data_list;
}
router.post("/",function(req,res){
    user_payload = req.body;
    const githubId = req.body.github_id;
    axios.get(`https://api.github.com/users/${githubId}`).then(function(response){
        const github_detail  = response.data;
        const repo_url = github_detail.repos_url;
        axios.get(repo_url).then(function(response){
            console.log("MY REPO INFO");
            user_repos = getrepos(response.data); 
            let profile_data = {};
            profile_data["id"] = github_detail.login;
            profile_data["avatar_url"] = github_detail.avatar_url;
            profile_data["name"] = github_detail.name;
            profile_data["company"] = github_detail.company;
            profile_data["blog"] = github_detail.blog;
            profile_data["location"] = github_detail.location;
            profile_data["email"] = github_detail.email;
            profile_data["bio"] = github_detail.bio;
            profile_data = {...profile_data,...user_payload};
            profile_data["repos"] = user_repos;
            // Pushing the user detail into Database.
            const userdata = new UserInfo(profile_data);
            userdata.save()
            .then(savedDoc => {
                console.log(`Saved userdata with id: ${savedDoc.id}`);
            }, err => {
                console.log(`Error in saving userdata ${err}`);
            });
            res.send(profile_data);
        }).catch(function(err){
            console.log(err);
        })
    }).catch(function(err){
        console.log(err);
    });
});

module.exports = router;