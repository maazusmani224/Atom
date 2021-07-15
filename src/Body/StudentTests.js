import './StudentTests.css';
import React from "react";
import {Card,Label,Transition,Placeholder,Icon,Button} from 'semantic-ui-react'

export default function StudentTests(props){
    return(
        <div className="tests__tab">
      {props.loading ? (
        [1, 1, 1].map((elem) => (
          <Card>
            <Card.Content
              style={{
                background: "linear-gradient(to right, #232526, #414345)",
              }}
            >
              <Card.Header>
                <Label as="a" color='blue' size="large">
                  <Placeholder>
                    <Placeholder.Line />
                  </Placeholder>
                </Label>
              </Card.Header>
            </Card.Content>
            <Card.Content>
              <Card.Meta></Card.Meta>
            </Card.Content>
            <Card.Content>
              <Card.Description>
                <Placeholder>
                  <Placeholder.Line />
                </Placeholder>
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Placeholder>
                <Placeholder.Line />
              </Placeholder>
            </Card.Content>
          </Card>
        ))
      ) : (
        <Transition.Group
        as={Card.Group}
        centered
        duration={400}
        animation ='pulse'
        className='cardsgroup'
        >
          {props.tests.map((doc,index) => (
            <Card
              key={doc.id}
              className="test__card"
              id={doc.id}
            >
              <Card.Content
                style={{
                  background: "linear-gradient(to right, #232526, #414345)",
                }}
              >
                <Card.Header>
                  <Label as="a" index={index} color="blue" size="large">
                    {doc.data.title}
                  </Label>
                </Card.Header>
              </Card.Content>
              <Card.Content meta={doc.data.created} />
              <Card.Content><Card.Description>Max Marks:{doc.data.marks}{doc.data.active&&<Button basic color='green' style={{margin:'15px'}}>Take Test</Button>}</Card.Description></Card.Content>
            </Card>
          ))}
        </Transition.Group>
      )}
      </div>
    )
}