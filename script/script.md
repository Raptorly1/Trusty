**Fact Checker Implementation:**

1. The input is taken through Google’s VertexAI search, which understands the context behind the input and then summarizes it into some keywords.   
2. Those keywords are then used in a Google search to find relevant URLs  
3. We do data cleaning to make sure there are never broken, duplicate, or irrelevant URLs  
4. An LLM with our custom instructions/guidelines/examples reviews the URLs and will go back to step 1 to cross-reference the original URLs  
5. Once that is finalized, another LLM will review the verdict and rewrite it, making sure the most credible sources are used. 

In the backend, the LLM is given dozens of specific examples. Here is a summary of the data given to the LLM before the user interacts with our website	

Credibility rating:  
![][image1]  
To keep our app’s data consistent and the workflow stable, we designed the AI components to always return answers in the same format,  with zero randomness. That means no matter how many times you run it, you’ll get results that are reliable and predictable.

Example of a response format we force one model to respond in:  
![][image2]
