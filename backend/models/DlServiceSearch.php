<?php

namespace backend\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use backend\models\DlService;

/**
 * DlServiceSearch represents the model behind the search form about `backend\models\DlService`.
 */
class DlServiceSearch extends DlService
{
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'sys_id', 'master_id', 'price', 'cycles', 'type', 'commission_type'], 'integer'],
            [['service_code', 'product_code', 'description', 'created_at', 'updated_at'], 'safe'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function scenarios()
    {
        // bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }

    /**
     * Creates data provider instance with search query applied
     *
     * @param array $params
     *
     * @return ActiveDataProvider
     */
    public function search($params)
    {
        $query = DlService::find();

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
            'sort' => ['defaultOrder' => ['id' => SORT_DESC]]
        ]);

        $this->load($params);

        if (!$this->validate()) {
            // uncomment the following line if you do not want to any records when validation fails
            // $query->where('0=1');
            return $dataProvider;
        }

        $query->andFilterWhere([
            'id' => $this->id,
            'sys_id' => $this->sys_id,
            'master_id' => $this->master_id,
            'price' => $this->price,
            'cycles' => $this->cycles,
            'type' => $this->type,
            'commission_type' => $this->commission_type,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ]);

        $query->andFilterWhere(['like', 'service_code', $this->service_code])
            ->andFilterWhere(['like', 'product_code', $this->product_code])
            ->andFilterWhere(['like', 'description', $this->description]);

        return $dataProvider;
    }
}
