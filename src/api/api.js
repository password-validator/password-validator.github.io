export async function get(url){
    try{
        const options = {
            method: "get",
            headers: {'Content-Type': 'application/json'}
        };

        const response = await fetch(url, options);
        if(response.ok == false){
            const error = await response.json();
            throw new Error(error.message);
        }

        try{
            return await response.json();
        } catch (err){
            return response;
        }
    } catch(err){
        alert(err.message);
        throw err;
    }
}

