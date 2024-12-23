import { Redis } from 'ioredis';

const redis=new Redis(process.env.REDIS_URL)

const setTestData = async (key, test) => {
  try {
   
      await redis.set(key, test,'EX',3600); 
      console.log('Successfully set the testData');
    
  } catch (error) {
    console.error('Error setting testData:', error);
  }
}

const getTestData = async (key) => {
  try {
 
   const testData= redis.get(key).then((result) => {
       return result
      });
      return testData;
     
    
  } catch (error) {
    console.error('Error getting testData:', error);
    return null; // Return null in case of error
  }
}



// Export the functions
export { setTestData, getTestData };
