

const url="http://127.0.0.1:5000/jobadverts/1234"

export const getJobs = async () => {
    const response = await fetch(url)

    return await response.json();
    
};
