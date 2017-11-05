sudo docker-compose down
sudo docker-compose pull
sudo docker-compose up -d
sudo docker cp public boebot_boebot_1:/usr/src/boebot
sudo docker cp src/bwd boebot_boebot_1:/usr/src/boebot/src
sudo docker-compose logs -f
