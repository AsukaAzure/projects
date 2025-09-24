const ALLOWED_TAGS = [ "js", "C", "C++", "html", "Linux"];

export function validQuestion({title, body }){

    const errors = {}

    if(!title || title.trim().length<10 || title.trim().length>150){
        errors.title= "Title must be 10-150 characters"
    }

    if(!body || body.trim().length<20){
        errors.body= "Body must contain more than 20 characters"
    }
    return {valid: Object.keys(errors).length === 0, errors}
}