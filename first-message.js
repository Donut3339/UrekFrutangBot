const addReactions = (message, reactions) => {
  message.react(reactions[0])
  reactions.shift()
  if (reactions.length > 0) {
    setTimeout(() => addReactions(message, reactions), 750)
  }
}

module.exports = async (client, id, text, reactions = []) => {
  // Get the channel
  const channel = client.channels.cache.get(id)
  // Get the message
  const message = channel.messages.cache.get(messageId)
  // Apply the new text
  message.edit(text)

  // Apply the reactions using the same method from the video
  if (reactions.length > 0) {
    addReactions(message, reactions)
  }

  console.log('CHANNEL:', channel)
  console.log('MESSAGE:', message)
}