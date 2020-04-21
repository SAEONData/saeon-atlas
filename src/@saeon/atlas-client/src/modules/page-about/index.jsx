import React from 'react'
import { Grid, Card, CardHeader, CardContent, Fade } from '@material-ui/core'

export default () => (
  <Fade in={true}>
    <Grid container justify="center" style={{ position: 'absolute', top: 150, zIndex: 1 }}>
      <Grid item xs={4}>
        <Card variant="outlined" style={{ textAlign: 'center', opacity: 0.8 }}>
          <CardHeader title="About" />
          <CardContent>&copy; SAEON 2020</CardContent>
        </Card>
      </Grid>
    </Grid>
  </Fade>
)