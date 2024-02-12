--- GITHUB ---
# Developer notes
## Don't merge your own pull request!
Let somebody know that you've made a PR, even request code review, and make sure somebody else get a sets of eyes on it before we merge into main
## It's a lot easier to catch issues this way than rolling back main after we break everything
If you are uncomfortable with git at all, take it slow and follow each step every single commit for at least the first few <br>
Eventually it'll be second nature
## How to start a new branch
1. Clone repo if you haven't already:
```
git clone https://github.com/eoinmtreacy/comp30380-dublin-bikes.git
```

2. Check out main, pull down from main to pull any changes
```git pull```
3. Checkout a new branch
```git checkout -b BRANCH_NAME```
4. Make changes in branch
5. Checkout main again, and then merge into your branch

```
git checkout main
git pull
git checkout MY_BRANCH
git merge main
git push
```

This checkout into main is to prevent issues with pushing. If you merge main into the branch you've just edited and there are no conflicts and nothing breaks, then it's likely fine.

Or if you are using VS Code: 
1. Open main branch at the bottom 
2. Open Source Control in side bar (3 dots) 
3. Pull 
5. Open MY_BRANCH at the bottom
6. Merge from main 
7. Commit as you work using source control 
8. Sync changes using source control
9. On Github, open pull request
## 10. Allow another team member to accept the pull request, do not commit or push to main!

---------------

This assignment describes the project work for COMP30830. Refer also to the lecture
notes on Brightspace.
The goal of this project is to develop a web application to display occupancy and weather
information for Dublin Bikes.
You will conduct the project in a team using the Scrum methodology.
The project should be submitted before the last week of the module. This is a hard
deadline.

(a) [45]• Deliverable Project This is not an exhaustive list, but contains the main elements
of a working solution
1. data collection through JCDecaux API
2. data management/storage in RDS DB on AWS
3. display bike stations on map
4. flask web application (python)
5. occupancy information
©UCD Semester II/ Modular Page 1 of 2
6. weather information
7. interactivity (click, API request, handle response)
8. ML model for predicting occupancy based on weather patterns, trained on
collected data
9. project served on a named host over the web on your EC2 instance
10. Github repo, including source code, logs, commit history, branches, etc
11. 
(b) [45]• Project Management
1. Design, planning notes and materials, discussion of Requirements, mock-
ups, ...
2. Scrum project management (trello board, slack logs, google docs, etc)
3. Meeting notes (log of daily standup, notes from sprint reviews, retrospec-
tives
4. feature selection/product backlog for each sprint (× 4)
5. burndown charts, (sprint and/or release) for each sprint (× 4)
6. managing deliverables, prototypes
7. 
(c) [10]• Personal Notes (Individual Submission)
1. learning journal
2. personal review
3. retrospective of the project
