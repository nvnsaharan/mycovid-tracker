import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react';
import './InfoBox.css';


function InfoBox({ title, cases, active, isRed, Total, ...props }) {
    return (
        <Card style={{ backgroundColor: 'transparent', border: '2px solid gray' }} className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`} onClick={props.onClick} >
            <CardContent>
                <Typography style={{ color: 'darkgray', fontWeight: 'bold' }} className='infoBox_title' color='textSecondary'>{title}</Typography>
                <h2 className={`infoBox_cases ${!isRed && 'infoBox--green'}`}>{cases}</h2>
                <Typography style={{ color: 'darkgray', fontWeight: 'bold' }} className='infoBox_Total' color='textSecondary'>{Total} Total</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
