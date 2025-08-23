const isVerificationSuccessful = (apiData) => {
    // console.log(result.data)
    // if (!result || !result.data) return false;
    // const apiData = result.data;

    // First check for explicit error codes
    // const errorCodes = [ '404', '400'];
    // if (apiData.code && errorCodes.includes(String(apiData.code))) return false;
    // if (apiData.status === 'INVALID') return false;

    // Define negative words/phrases that indicate failure - using specific phrases to avoid false positives
    const negativeWords = [
        ' not ',
        ' no ',
        'no record',
        'not found',
        'not valid',
        'not verified',
        'not active',
        'no match',
        'no data',
        'does not exist',
        'does not match',
        'doesn\'t exist',
        'doesn\'t match',
        'cannot verify',
        'can\'t verify',
        'verification failed',
        'validation failed',
        'request failed',
        'processing failed',
        'failed to process',
        'failed to verify',
        'is invalid',
        'are invalid',
        'incorrect details',
        'data mismatch',
        'details mismatch',
        'service unavailable',
        'currently unavailable',
        'access denied',
        'request denied',
        'account blocked',
        'account suspended',
        'account inactive',
        'document expired',
        'subscription expired',
        'plan cancelled'
    ];

    // Check if the response contains negative indicators (using exact phrase matching)
    const responseText = ' ' + JSON.stringify(apiData).toLowerCase() + ' '; // Add spaces for boundary checking
    
    // Debug: Check each negative word individually
    console.log('🔍 Full API Response:', apiData);
    console.log('📝 Response Text:', responseText);
    
    const foundNegatives = negativeWords.filter(phrase => responseText.includes(phrase));
    console.log('❌ Found negative phrases:', foundNegatives);
    
    const hasNegativeWord = foundNegatives.length > 0;
    console.log('🎯 Has negative word:', hasNegativeWord);
    // If negative words are found, treat as error
    if (hasNegativeWord) {
        console.log('Verification failed: Negative indicators found in response', apiData);
        return false;
    }

    // Positive success indicators (only check if no negative words found)
    // if (result.success === true) return true;
    // if (apiData.message) {
    //     const message = apiData.message.toLowerCase();
    //     if (message.includes('verified successfully')) return true;
    //     if (message.includes('record found')) return true;
    //     if (message.includes('verification successful')) return true;
    // }
    // if (apiData.status === 'VALID' || apiData.status === 'ACTIVE' || apiData.verified === true || apiData.account_exists === true) return true;
    // if (String(apiData.code) === '1000') return true;

    // If no negative words and some positive indicators, consider successful
    return true;
};

const re =isVerificationSuccessful("Data Extracted")
console.log(re  )