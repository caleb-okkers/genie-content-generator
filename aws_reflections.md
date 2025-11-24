# Deployment Reflection

## AWS Deployment Summary
- Created an Elastic Beanstalk application using Node.js platform.
- Packaged the Lovable-generated application into a ZIP file.
- Deployed using "Upload from Local File" option in Elastic Beanstalk.
- EB automatically uploaded the ZIP to the correct S3 bucket.
- Used a t2.micro instance (free tier).
- Health monitoring left at Basic.
- No managed platform updates enabled.
- Environment runs successfully at: https://af-south-1.console.aws.amazon.com/elasticbeanstalk/home?region=af-south-1#/environment/dashboard?environmentId=e-7wzmcpbrca

## Security
- Used IAM admin user (not root).
- No public S3 buckets.
- EC2 only accessible via Elastic Beanstalk load balancer URL.
- No hardcoded credentials.

## Multi-cloud Notes
- Azure deployment handled by partner.
- AWS deployment reached parity using same ZIP and same environment config.