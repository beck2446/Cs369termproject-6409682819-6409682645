#!/bin/bash
# Update the instance
sudo yum update -y || sudo apt-get update -y
# Install Git
sudo yum install -y git || sudo apt-get install -y git
# Install Node.js and npm for Amazon Linux 2
sudo yum install -y nodejs npm || {
# For Ubuntu-based instances
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
}
# Install pm2 globally using npm
sudo npm install pm2 -g
# Go to the home directory of the current user
cd /home/ec2-user
# Clone the repository
git clone https://github.com/beck2446/Cs369termproject-6409682819-6409682645.git
# Navigate to the project directory and install dependencies
#cd Cs369termproject-6409682819-6409682645
#sudo npm install
# Start the application using pm2
# sudo pm2 start index.js
# Save the current pm2 processes
# sudo pm2 save
# Ensure pm2 starts on boot
# sudo pm2 startup
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo cp -r /home/ec2-user/Cs369termproject-6409682819-6409682645/public /usr/share/nginx/html/
sudo cp -r /home/ec2-user/Cs369termproject-6409682819-6409682645/uploads /usr/share/nginx/html/
sudo cp /home/ec2-user/Cs369termproject-6409682819-6409682645/dbconfig.js /usr/share/nginx/html/
sudo cp /home/ec2-user/Cs369termproject-6409682819-6409682645/index.js /usr/share/nginx/html/
sudo cp /home/ec2-user/Cs369termproject-6409682819-6409682645/package-lock.json /usr/share/nginx/html/
sudo cp /home/ec2-user/Cs369termproject-6409682819-6409682645/package.json /usr/share/nginx/html/
# Restart Nginx to reflect the changes
sudo systemctl restart nginx
