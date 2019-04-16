const Story = require("../models/story");

exports.createStory = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const story = new Story({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  story
    .save()
    .then(createdStory => {
      res.status(201).json({
        message: "Story added successfully",
        story: {
          ...createdStory,
          id: createdStory._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a story failed!"
      });
    });
};

exports.updateStory = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const story = new Stories({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Stories.updateOne({ _id: req.params.id, creator: req.userData.userId }, story)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate story!"
      });
    });
};

exports.getStories = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const storyQuery = Story.find();
  let fetchedStories;
  if (pageSize && currentPage) {
    storyQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  storyQuery
    .then(documents => {
      fetchedStories = documents;
      return Story.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Stories fetched successfully!",
        stories: fetchedStories,
        maxStories: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching stories failed!"
      });
    });
};

exports.getStory = (req, res, next) => {
  Story.findById(req.params.id)
    .then(story => {
      if (story) {
        res.status(200).json(story);
      } else {
        res.status(404).json({ message: "Story not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching story failed!"
      });
    });
};

exports.deleteStory = (req, res, next) => {
  Story.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting story failed!"
      });
    });
};
