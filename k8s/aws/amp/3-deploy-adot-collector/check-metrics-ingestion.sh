# Define the Prometheus query endpoint URL. This can be found in the Amazon Managed Service for Prometheus console page 
# under the respective workspace. 

export AMP_QUERY_ENDPOINT=https://aps-workspaces.us-east-2.amazonaws.com/workspaces/ws-4d589447-c213-40fc-ae2d-01f8cd2cecb2/api/v1/query

# credentials are infered from the default profile
awscurl -X POST --region us-east-2 --service aps "$AMP_QUERY_ENDPOINT?query=up"  
