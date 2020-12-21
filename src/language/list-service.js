class LinkedList {
  constructor() {
    this.head = null
  }
  add(node) {
    if (!this.head) {
      return this.head = node
    }
    let currentNode = this.head
    while (currentNode.next) {
      currentNode = currentNode.next
    }
    currentNode.next = node
  }
  moveHeadBack(places) {
    if (!this.head) {
      return 'Empty list'
    }
    if (!this.head.next) {
      return 'Only 1 item in list'
    }
    const headWord = this.head
    this.head = this.head.next
    headWord.next = null
    let currentNode = this.head
    for (let i = 1; i < places; i++) {
      if (!currentNode.next) {
        break
      }
      currentNode = currentNode.next
    }
    headWord.next = currentNode.next
    currentNode.next = headWord
  }
}

class Node {
  constructor(value, next = null) {
    this.value = value
    this.next = next
  }
}

module.exports = {
  LinkedList,
  Node
}