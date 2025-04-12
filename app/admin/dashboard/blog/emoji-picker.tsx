"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

// Common emoji categories
const emojiCategories = {
  smileys: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘"],
  gestures: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "👋", "🤚", "🖐️", "✋"],
  people: ["👨", "👩", "👧", "👦", "👶", "👵", "👴", "👮", "💂", "👷", "👸", "🤴", "👳", "👲", "🧕", "🧔", "👱"],
  animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧"],
  food: ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆"],
  travel: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🚚", "🚛", "🚜", "🛴", "🚲", "🛵", "🏍️"],
  activities: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🏓", "🏸", "🥅", "🏒", "🏑", "🥍", "🏏"],
  objects: ["⌚", "📱", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️", "🗜️", "💽", "💾", "💿", "📀", "📼", "📷", "📸"],
  symbols: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "♥️", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝"],
}

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState<keyof typeof emojiCategories>("smileys")
  const [filteredEmojis, setFilteredEmojis] = useState<string[]>([])

  useEffect(() => {
    if (searchTerm) {
      // If there's a search term, flatten all categories and filter
      const allEmojis = Object.values(emojiCategories).flat()
      setFilteredEmojis(allEmojis)
    } else {
      // Otherwise, show the active category
      setFilteredEmojis(emojiCategories[activeCategory])
    }
  }, [searchTerm, activeCategory])

  return (
    <div className="emoji-picker">
      <Input
        type="text"
        placeholder="Search emoji..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2"
      />

      {!searchTerm && (
        <div className="flex overflow-x-auto mb-2 pb-1">
          {Object.keys(emojiCategories).map((category) => (
            <button
              key={category}
              className={`px-2 py-1 text-xs whitespace-nowrap ${
                activeCategory === category ? "bg-gray-200 rounded" : ""
              }`}
              onClick={() => setActiveCategory(category as keyof typeof emojiCategories)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-7 gap-1 max-h-[200px] overflow-y-auto">
        {filteredEmojis.map((emoji, index) => (
          <button key={index} className="text-xl p-1 hover:bg-gray-100 rounded" onClick={() => onEmojiSelect(emoji)}>
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
