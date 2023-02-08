# Define the Prometheus query endpoint URL. This can be found in the Amazon Managed Service for Prometheus console page 
# under the respective workspace. 

export AMP_QUERY_ENDPOINT=https://aps-workspaces.us-east-2.amazonaws.com/workspaces/ws-e92bb9b4-6fae-4d43-afbc-5b39925446eb/api/v1/query

# credentials are infered from the default profile
awscurl -X POST --region us-east-2 \
                  --service aps "$AMP_QUERY_ENDPOINT?query=up"  
