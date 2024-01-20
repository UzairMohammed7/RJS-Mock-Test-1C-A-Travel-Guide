import {Component} from 'react'

import Loader from 'react-loader-spinner'

import './App.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
}

class App extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    travelGuideData: [],
  }

  componentDidMount() {
    this.getTravelGuideData()
  }

  getTravelGuideData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const apiUrl = 'https://apis.ccbp.in/tg/packages'

    const options = {method: 'GET'}

    const response = await fetch(apiUrl, options)
    console.log(response)

    if (response.ok === true) {
      const fetchedData = await response.json()
      console.log(fetchedData)

      const formattedData = fetchedData.packages.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
        description: each.description,
      }))

      this.setState({
        apiStatus: apiStatusConstants.success,
        travelGuideData: formattedData,
      })
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="TailSpin" color="#00BFFF" height={30} width={30} />
    </div>
  )

  renderSuccessView = () => {
    const {travelGuideData} = this.state

    return (
      <div>
        <h1>Travel Guide</h1>
        <hr />
        <ul>
          {travelGuideData.map(eachItem => (
            <li key={eachItem.id}>
              <img src={eachItem.imageUrl} alt={eachItem.name} />
              <h1>{eachItem.name}</h1>
              <p>{eachItem.description}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderAllViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  render() {
    return <div>{this.renderAllViews()}</div>
  }
}

export default App
