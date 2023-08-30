import React, {useState, useEffect} from 'react'
import Api from './api'

export const useSpeakersByProgram = (props) => {
    const [loading, updateLoading] = useState(false)
    const [list, updateList] = useState([])
    const [error, updateError] = useState(null)

    useEffect(() => {
        if (props.program) {
            fetchSpeaker(props.program)
        }
    }, [props.program])

    const fetchSpeaker = async(program) => {
        updateLoading(true)
        let json = await Api.fetchSpeakersByProgram({ event_program: program });

        if (json && !json.code && json.result) {            
            let newList = json.data || []
            updateList(newList)
            updateLoading(false)
            updateError(null)            
            
        } else {
            
            updateList([])
            updateLoading(false)
            updateError({message: json.message})
        }
        
    }

    return {loading, list, error}
}

