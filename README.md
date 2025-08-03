# NewsletterX Deployment

# Server Setup

```json
aws ec2 create-security-group --group-name "launch-wizard-6" --description "launch-wizard-6 created 2025-08-03T21:38:28.547Z" --vpc-id "vpc-0080752354c7ec130" 
aws ec2 authorize-security-group-ingress --group-id "sg-preview-1" --ip-permissions '{"IpProtocol":"tcp","FromPort":22,"ToPort":22,"IpRanges":[{"CidrIp":"0.0.0.0/0"}]}' '{"IpProtocol":"tcp","FromPort":443,"ToPort":443,"IpRanges":[{"CidrIp":"0.0.0.0/0"}]}' '{"IpProtocol":"tcp","FromPort":80,"ToPort":80,"IpRanges":[{"CidrIp":"0.0.0.0/0"}]}' 
aws ec2 run-instances --image-id "ami-0306865c645d1899c" --instance-type "t2.large" --block-device-mappings '{"DeviceName":"/dev/xvda","Ebs":{"Encrypted":false,"DeleteOnTermination":true,"Iops":3000,"SnapshotId":"snap-09f1ca2634b5940ba","VolumeSize":32,"VolumeType":"gp3","Throughput":125}}' --network-interfaces '{"AssociatePublicIpAddress":true,"DeviceIndex":0,"Groups":["sg-preview-1"]}' --credit-specification '{"CpuCredits":"standard"}' --tag-specifications '{"ResourceType":"instance","Tags":[{"Key":"Name","Value":"NewsletterX-Instance"}]}' --metadata-options '{"HttpEndpoint":"enabled","HttpPutResponseHopLimit":2,"HttpTokens":"required"}' --private-dns-name-options '{"HostnameType":"ip-name","EnableResourceNameDnsARecord":true,"EnableResourceNameDnsAAAARecord":false}' --count "1" 
```

![2.png](2.png)

![3.png](3.png)

![1.png](1.png)

![4.png](4.png)

![5.png](5.png)

## Update Inbound Rule

open the security tab and click on the security group

![image.png](image.png)

open the inbound rules and add the below rules

![image.png](image%201.png)

![image.png](image%202.png)

## SSH to the server

After the installation of the key pair you need to move the certificate to the correct location 

```bash
 cp ./newsletterx-deplyment.pem ~/.ssh/
```

update the permissions of the certificate 

```bash
chmod 400 newsletterx-deplyment.pem
```

user the below command to SSH to the reader 

```bash
ssh -i "newsletterx-deplyment.pem" admin@ec2-3-8-161-27.eu-west-2.compute.amazonaws.com
```

![image.png](image%203.png)

# Git hub Repository Cloning

## Git installation

```bash
sudo apt update
sudo apt install git -y
```

## Repo Cloning

to clone the repository you should have a personal access token and clone the repository as below

```bash
git clone https://<USER>:<ACCESS-TOKEN>@github.com/Mangopulse/nx.git
```

CD to the cloned repo 

```bash
cd nx/
```

use the needed branch for the deployment 

```bash
git switch <BRANCH-NAME>
```

# Application Installation

Update the credentials of the installation script 

```bash
chmod +x installation.sh
```

run the installation script to 

```bash
./setup.sh "http://localhost:8080" "SG.your-key-here"
```

The installation script do the below 

- install Docker / Docker compose
- install java
- install maven

beside installations it will 

- build the java project
- run the docker compose file
- update the variables [Backend Link and the SendGrid API Key]
- configure NginX

Below is when the script finished successfully 

![image.png](image%204.png)

# Register and Test MDN

## Create Almayadeen user

![image.png](image%205.png)

## Verify the user then login

you will receive this email 

![image.png](image%206.png)

after clicking on the button 

![image.png](image%207.png)

## Login

![image.png](image%208.png)

## Initialize the sender

![image.png](image%209.png)

![image.png](image%2010.png)

![image.png](image%2011.png)

after pressing submit you will receive an email to verify the sender from SendGrid 

![image.png](image%2012.png)

![image.png](image%2013.png)

![image.png](image%2014.png)

after verify user refresh the template page 

![image.png](image%2015.png)

## Send a preview Email

after finishing the sender verifying option click on preview and enter the needed email  

![image.png](image%2016.png)

press send

![image.png](image%2017.png)

check the email you have chosen 

![image.png](image%2018.png)

![image.png](image%2019.png)