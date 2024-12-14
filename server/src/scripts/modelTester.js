// src/scripts/modelTester.js
const inquirer = require('inquirer');
const UserModel = require('../models/UserModel');
const PrayerModel = require('../models/PrayerModel');
const EventModel = require('../models/EventModel');
require('dotenv').config();

async function mainMenu() {
    while (true) {
        try {
            const { choice } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'choice',
                    message: 'Select an action:',
                    choices: ['Test Users', 'Test Prayers', 'Test Events', 'Exit']
                }
            ]);

            if (choice === 'Exit') {
                console.log('Goodbye!');
                process.exit(0);
            }

            await handleChoice(choice);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
}

async function handleChoice(choice) {
    switch (choice) {
        case 'Test Users':
            await testUsers();
            break;
        case 'Test Prayers':
            await testPrayers();
            break;
        case 'Test Events':
            await testEvents();
            break;
    }
}

async function testUsers() {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Choose User action:',
            choices: [
                'Create User',
                'Find User by Email',
                'Get User Stats',
                'Back to Main Menu'
            ]
        }
    ]);

    switch (action) {
        case 'Create User':
            const userData = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Enter name:'
                },
                {
                    type: 'input',
                    name: 'email',
                    message: 'Enter email:'
                },
                {
                    type: 'password',
                    name: 'password',
                    message: 'Enter password:'
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'Select role:',
                    choices: ['member', 'coordinator', 'moderator', 'admin']
                },
                { type: 'list',
                    name: 'status',
                    message: 'Select status:',
                    choices: ['active', 'pending']
                }
            ]);

            try {
                const user = await UserModel.create(userData);
                console.log('\nUser created successfully:', user);
            } catch (error) {
                console.error('\nError creating user:', error.message);
            }
            break;

        case 'Find User by Email':
            const { email } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'email',
                    message: 'Enter email to search:'
                }
            ]);

            try {
                const user = await UserModel.findByEmail(email);
                if (user) {
                    console.log('\nUser found:', user);
                } else {
                    console.log('\nNo user found with that email');
                }
            } catch (error) {
                console.error('\nError finding user:', error.message);
            }
            break;

        case 'Get User Stats':
            try {
                const stats = await UserModel.getStats();
                console.log('\nUser Statistics:', stats);
            } catch (error) {
                console.error('\nError getting stats:', error.message);
            }
            break;
    }
}

async function testPrayers() {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Choose Prayer action:',
            choices: [
                'Create Prayer',
                'Get All Prayers',
                'Get Prayer Stats',
                'Back to Main Menu'
            ]
        }
    ]);

    switch (action) {
        case 'Create Prayer':
            const prayerData = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'user_id',
                    message: 'Enter user ID:'
                },
                {
                    type: 'input',
                    name: 'subject',
                    message: 'Enter subject:'
                },
                {
                    type: 'input',
                    name: 'message',
                    message: 'Enter message:'
                }
            ]);

            try {
                const prayer = await PrayerModel.create(prayerData);
                console.log('\nPrayer created successfully:', prayer);
            } catch (error) {
                console.error('\nError creating prayer:', error.message);
            }
            break;

        case 'Get All Prayers':
            try {
                const prayers = await PrayerModel.getAll();
                console.log('\nAll Prayers:', prayers);
            } catch (error) {
                console.error('\nError getting prayers:', error.message);
            }
            break;

        case 'Get Prayer Stats':
            try {
                const stats = await PrayerModel.getStats();
                console.log('\nPrayer Statistics:', stats);
            } catch (error) {
                console.error('\nError getting prayer stats:', error.message);
            }
            break;
    }
}

async function testEvents() {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Choose Event action:',
            choices: [
                'Create Event',
                'Get Upcoming Events',
                'Back to Main Menu'
            ]
        }
    ]);

    switch (action) {
        case 'Create Event':
            const eventData = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Enter title:'
                },
                {
                    type: 'input',
                    name: 'description',
                    message: 'Enter description:'
                },
                {
                    type: 'list',
                    name: 'event_type',
                    message: 'Select event type:',
                    choices: ['live_prayer', 'other']
                },
                {
                    type: 'input',
                    name: 'coordinator_id',
                    message: 'Enter coordinator ID:'
                },
                {
                    type: 'input',
                    name: 'start_time',
                    message: 'Enter start time (YYYY-MM-DD HH:mm:ss):'
                },
                {
                    type: 'input',
                    name: 'end_time',
                    message: 'Enter end time (YYYY-MM-DD HH:mm:ss):'
                }
            ]);

            try {
                const event = await EventModel.create(eventData);
                console.log('\nEvent created successfully:', event);
            } catch (error) {
                console.error('\nError creating event:', error.message);
            }
            break;

        case 'Get Upcoming Events':
            try {
                const events = await EventModel.getUpcoming();
                console.log('\nUpcoming Events:', events);
            } catch (error) {
                console.error('\nError getting upcoming events:', error.message);
            }
            break;
    }
}

// Start the CLI
console.log('\nWelcome to Model Tester CLI');
console.log('=========================\n');
mainMenu().catch(console.error);