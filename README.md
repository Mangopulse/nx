# NewsletterX Deployment

# Server Setup

```json
aws ec2 create-security-group --group-name "launch-wizard-6" --description "launch-wizard-6 created 2025-08-03T21:38:28.547Z" --vpc-id "vpc-0080752354c7ec130" 
aws ec2 authorize-security-group-ingress --group-id "sg-preview-1" --ip-permissions '{"IpProtocol":"tcp","FromPort":22,"ToPort":22,"IpRanges":[{"CidrIp":"0.0.0.0/0"}]}' '{"IpProtocol":"tcp","FromPort":443,"ToPort":443,"IpRanges":[{"CidrIp":"0.0.0.0/0"}]}' '{"IpProtocol":"tcp","FromPort":80,"ToPort":80,"IpRanges":[{"CidrIp":"0.0.0.0/0"}]}' 
aws ec2 run-instances --image-id "ami-0306865c645d1899c" --instance-type "t2.large" --block-device-mappings '{"DeviceName":"/dev/xvda","Ebs":{"Encrypted":false,"DeleteOnTermination":true,"Iops":3000,"SnapshotId":"snap-09f1ca2634b5940ba","VolumeSize":32,"VolumeType":"gp3","Throughput":125}}' --network-interfaces '{"AssociatePublicIpAddress":true,"DeviceIndex":0,"Groups":["sg-preview-1"]}' --credit-specification '{"CpuCredits":"standard"}' --tag-specifications '{"ResourceType":"instance","Tags":[{"Key":"Name","Value":"NewsletterX-Instance"}]}' --metadata-options '{"HttpEndpoint":"enabled","HttpPutResponseHopLimit":2,"HttpTokens":"required"}' --private-dns-name-options '{"HostnameType":"ip-name","EnableResourceNameDnsARecord":true,"EnableResourceNameDnsAAAARecord":false}' --count "1" 
```
<img width="1851" height="822" alt="2" src="https://github.com/user-attachments/assets/6caf0571-37b9-453d-b551-46d3259f3bb7" />
<img width="1225" height="653" alt="3" src="https://github.com/user-attachments/assets/5eb8cee8-f882-4cb4-862c-9ee51c52d41b" />
<img width="753" height="687" alt="1" src="https://github.com/user-attachments/assets/30600667-f823-48a5-a171-30bedd2ca125" />
<img width="1204" height="702" alt="4" src="https://github.com/user-attachments/assets/67732732-f514-4f2b-8e01-df1eeec46fff" />
<img width="1214" height="507" alt="5" src="https://github.com/user-attachments/assets/d3213800-ef59-44fe-adec-aaec3ee7703e" />

## Update Inbound Rule

open the security tab and click on the security group

<img width="1755" height="810" alt="image" src="https://github.com/user-attachments/assets/5be88c45-862d-4545-b9e0-e69e5957fe08" />


open the inbound rules and add the below rules
<img width="1634" height="648" alt="image 1" src="https://github.com/user-attachments/assets/e2176d4d-0ca9-4baf-98d6-d6228f01a692" />
<img width="1837" height="805" alt="image 2" src="https://github.com/user-attachments/assets/8d77b646-23f9-4125-8630-d89662417667" />



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

<img width="1036" height="212" alt="image 3" src="https://github.com/user-attachments/assets/28c23aea-f751-4a8e-891c-3e0639fa5f5a" />


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
./installation.sh "http://localhost:8080" "SG.your-key-here"
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

<img width="1405" height="992" alt="image 4" src="https://github.com/user-attachments/assets/62b96e13-090c-407b-ad1d-4cee8e2955d8" />


# Register and Test MDN

## Create Almayadeen user

<img width="1714" height="821" alt="image 5" src="https://github.com/user-attachments/assets/b7f32274-5d83-49f4-934d-a3153765ccc6" />


## Verify the user then login

you will receive this email 

<img width="1568" height="513" alt="image 6" src="https://github.com/user-attachments/assets/eb9897d2-5b77-4f93-94a9-3d702539fc20" />


after clicking on the button 
<img width="1582" height="259" alt="image 7" src="https://github.com/user-attachments/assets/2e6788f0-3c14-41da-9b94-8bf428205ddd" />


## Login
<img width="1910" height="987" alt="image 8" src="https://github.com/user-attachments/assets/5c6596cb-ad01-49b7-8da0-3dab160b31b9" />



## Initialize the sender

<img width="1914" height="987" alt="image 9" src="https://github.com/user-attachments/assets/859ca35a-884c-48ce-ae55-b14d5558da6d" />
<img width="668" height="369" alt="image 10" src="https://github.com/user-attachments/assets/6a4ee630-74e2-4387-a2f9-a9da38ce4bab" />
<img width="743" height="360" alt="image 11" src="https://github.com/user-attachments/assets/7c6fbd33-b50a-483c-85ae-3b70bded1745" />


after pressing submit you will receive an email to verify the sender from SendGrid 
<img width="1916" height="909" alt="image 12" src="https://github.com/user-attachments/assets/2bf337bc-1987-4caf-b429-9263712cf360" />
<img width="1584" height="765" alt="image 13" src="https://github.com/user-attachments/assets/e397f474-3cc5-4782-8dd9-100d37a1a4ba" />
<img width="1916" height="722" alt="image 14" src="https://github.com/user-attachments/assets/5c725692-f2fb-4206-b0ee-365588bf9c20" />



after verify user refresh the template page 

![Uploading image 15.png…]()


## Send a preview Email

after finishing the sender verifying option click on preview and enter the needed email  
<img width="1855" height="716" alt="image 16" src="https://github.com/user-attachments/assets/aea83e52-526e-4534-8f9d-556ae0f74732" />



press send
<img width="1583" height="974" alt="image 17" src="https://github.com/user-attachments/assets/cfaee681-e8ce-4846-b12a-1a88d29d5de7" />


check the email you have chosen 
<img width="1613" height="891" alt="image 18" src="https://github.com/user-attachments/assets/96b3e4b9-8aa8-4efd-9d9f-2476c4f7a967" />
<img width="914" height="764" alt="image 19" src="https://github.com/user-attachments/assets/2d0be373-4866-4711-a573-b12e84e82c72" />

