const Task = require('../models/task_model');

// Create Task
exports.createTask = async (req, res) => {
    try {
        const newTask = new Task({
            title: req.body.title,
            description: req.body.description,
            user: req.user.id // Linked to logged-in user
        });
        const task = await newTask.save();
        res.json(task);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Get All Tasks for a user
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ date: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Update Task
exports.updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Ensure user owns the task
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(task);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Delete Task
exports.deleteTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Task removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};