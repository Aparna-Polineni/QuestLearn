// src/screens/stage5/Level5_12.jsx — @Entity — Java to SQL tables (FILL)
import { useState } from 'react';
import Stage5Shell from './Stage5Shell';
import FillEditor from '../../components/FillEditor';
import './Level5_12.css';

const SUPPORT = {
  reveal: {
    concept: '@Entity',
    whatYouLearned: '@Entity tells JPA "this Java class is a database table". The class name becomes the table name (snake_case). Each field becomes a column. JPA reads these annotations on startup and generates the SQL schema.',
    realWorldUse: 'Every model in your Spring Boot app is an @Entity. Patient, Doctor, Ward, Appointment — they all map to tables. Understanding this mapping helps you predict the schema JPA generates.',
    developerSays: 'Always use @Table(name="...") to explicitly name your table. Default naming rules change between Hibernate versions — explicit is always safer.',
  },
};

const CODE_TEMPLATE = `@Entity
@Table(name = "[[patients]]")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.[[IDENTITY]])
    private [[Long]] id;

    @Column(name = "name", nullable = [[false]])
    private String name;

    @Column(name = "ward")
    private String ward;

    @Column(name = "priority", columnDefinition = "INT DEFAULT [[0]]")
    private int priority;

    @Column(name = "active")
    private [[boolean]] active;
}`;

const ANSWERS = ['patients', 'IDENTITY', 'Long', 'false', '0', 'boolean'];

export default function Level5_12() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <Stage5Shell levelId={12} canProceed={isCorrect} conceptReveal={SUPPORT.reveal}>
      <div className="l512-container">
        <div className="l512-brief">
          <div className="l512-brief-tag">🐘 Stage 5 · Level 5.12 · FILL</div>
          <h2>@Entity — One Annotation Turns Java Into a Database Table</h2>
          <p>Every class marked <code>@Entity</code> gets its own table. JPA reads the annotations on startup and generates the <code>CREATE TABLE</code> SQL you wrote in levels 5.1–5.5. Fill in the blanks to complete the Patient entity.</p>
        </div>

        <div className="l512-sql-ref">
          <div className="l512-ref-label">The SQL this generates ↓</div>
          <div className="l512-sql-block">
            <span className="kw">CREATE TABLE </span><span className="tbl">patients </span><span className="op">{'(\n'}</span>
            <span className="op">{'  '}</span><span className="col">id</span><span className="op">       </span><span className="typ">BIGINT</span><span className="op">       </span><span className="kw">PRIMARY KEY AUTO_INCREMENT</span><span className="op">{',\n'}</span>
            <span className="op">{'  '}</span><span className="col">name</span><span className="op">     </span><span className="typ">VARCHAR(255)</span><span className="op"> </span><span className="kw">NOT NULL</span><span className="op">{',\n'}</span>
            <span className="op">{'  '}</span><span className="col">ward</span><span className="op">     </span><span className="typ">VARCHAR(255)</span><span className="op">{',\n'}</span>
            <span className="op">{'  '}</span><span className="col">priority</span><span className="op"> </span><span className="typ">INT</span><span className="op">         </span><span className="kw">DEFAULT 0</span><span className="op">{',\n'}</span>
            <span className="op">{'  '}</span><span className="col">active</span><span className="op">   </span><span className="typ">BOOLEAN</span>
            <span className="op">{'\n);'}</span>
          </div>
        </div>

        <FillEditor
          template={CODE_TEMPLATE}
          answers={ANSWERS}
          language="java"
          onCorrect={() => setIsCorrect(true)}
        />

        <div className="l512-bridge">
          <div className="l512-bridge-row">
            <div className="l512-bridge-col">
              <div className="l512-bheader">Java</div>
              {[['@Entity','→ This class = a table'],['@Table(name="x")','→ Table name'],['@Id','→ PRIMARY KEY'],['@GeneratedValue','→ AUTO_INCREMENT'],['@Column(nullable=false)','→ NOT NULL']].map(([a,b])=>(
                <div key={a} className="l512-brow"><code>{a}</code><span>{b}</span></div>
              ))}
            </div>
            <div className="l512-bridge-col">
              <div className="l512-bheader">SQL</div>
              {[['patients','← table name'],['id BIGINT PK','← @Id field'],['AUTO_INCREMENT','← GenerationType.IDENTITY'],['NOT NULL','← nullable=false'],['DEFAULT 0','← columnDefinition']].map(([a,b])=>(
                <div key={a} className="l512-brow"><code>{a}</code><span>{b}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Stage5Shell>
  );
}
