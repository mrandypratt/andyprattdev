type ToolTablePropsType = {
  version: "one" | "two" | "three";
}

export const ToolTable = ({version}: ToolTablePropsType) => {

  const versionTools = {
    one: ["Canva", "Miro", "Draw.io", "React", "Material UI", "GoDaddy", "AWS S3 Bucket"],
    two: ["TypeScript", "Node.js", "Express", "Socket.io", "AWS EC2 & Elastic IP", "PM2", "Aync/Await"],
    three: ["Rest API", "MongoDB", "Mongoose", "FullStory"]
  }

  const tools = versionTools[version];

  return (
    <table>
      
      <tr>
        <th rowSpan={tools.length}>Tools Used</th>
        <td>{tools[0]}</td>
      </tr>

      {tools.map((tool, index) => {
        if (index !== 0) {
          return (
            <tr>
              <td>
                {tool}
              </td>
            </tr>
          )
        }
      })}

    </table>
  )
}